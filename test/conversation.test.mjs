import test from 'node:test';
import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import {
  historyCharCount,
  parseConversationInput,
  runConversation,
  shouldStartInteractive,
  splitMessagesForCompaction,
  systemWithConversationSummary,
} from '../dist/lib/conversation.js';

class CaptureOutput extends Writable {
  constructor() {
    super();
    this.text = '';
  }
  _write(chunk, _encoding, callback) {
    this.text += chunk.toString();
    callback();
  }
}

function fakeReadline(lines) {
  const queue = [...lines];
  return {
    question: async () => {
      if (queue.length === 0) return '/bye';
      return queue.shift();
    },
    close: () => {},
  };
}

test('interactive mode starts only without prompt/stdin on a tty', () => {
  assert.equal(shouldStartInteractive({ stdinIsTTY: true, stdoutIsTTY: true }), true);
  assert.equal(shouldStartInteractive({ explicitPrompt: 'hi', stdinIsTTY: true, stdoutIsTTY: true }), false);
  assert.equal(shouldStartInteractive({ positionalPrompt: 'hi', stdinIsTTY: true, stdoutIsTTY: true }), false);
  assert.equal(shouldStartInteractive({ stdinText: 'hi', stdinIsTTY: true, stdoutIsTTY: true }), false);
  assert.equal(shouldStartInteractive({ stdinIsTTY: false, stdoutIsTTY: true }), false);
  assert.equal(shouldStartInteractive({ stdinIsTTY: true, stdoutIsTTY: false }), false);
});

test('conversation command parser handles exit, clear, compact, help, empty, and messages', () => {
  assert.deepEqual(parseConversationInput('/bye'), { kind: 'exit' });
  assert.deepEqual(parseConversationInput('/exit'), { kind: 'exit' });
  assert.deepEqual(parseConversationInput('/quit'), { kind: 'exit' });
  assert.deepEqual(parseConversationInput('/clear'), { kind: 'clear' });
  assert.deepEqual(parseConversationInput('/compact'), { kind: 'compact' });
  assert.deepEqual(parseConversationInput('/help'), { kind: 'help' });
  assert.deepEqual(parseConversationInput('   '), { kind: 'empty' });
  assert.deepEqual(parseConversationInput('hello'), { kind: 'message', text: 'hello' });
});

test('compaction helpers count, split, and append summary', () => {
  const messages = [
    { role: 'user', content: 'one' },
    { role: 'assistant', content: 'two' },
    { role: 'user', content: 'three' },
  ];
  assert.equal(historyCharCount(messages, 'summary') > 'onetwothreesummary'.length, true);
  const split = splitMessagesForCompaction(messages, 1);
  assert.deepEqual(split.oldMessages, [{ role: 'user', content: 'one' }]);
  assert.deepEqual(split.recentMessages, [
    { role: 'assistant', content: 'two' },
    { role: 'user', content: 'three' },
  ]);
  assert.equal(systemWithConversationSummary('system', ''), 'system');
  assert.match(systemWithConversationSummary('system', 'summary'), /conversation summary/);
});

test('runConversation keeps in-memory message history across turns', async () => {
  const calls = [];
  const output = new CaptureOutput();
  await runConversation({
    cloneLabel: 'Alice (alice)',
    model: {},
    system: 'system',
    tools: {},
    output,
    readline: fakeReadline(['hello', 'again', '/bye']),
    stream: async (options) => {
      calls.push(options.messages.map((message) => ({ role: message.role, content: message.content })));
      options.onText?.(`response-${calls.length}`);
      return `response-${calls.length}`;
    },
  });

  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0], [{ role: 'user', content: 'hello' }]);
  assert.deepEqual(calls[1], [
    { role: 'user', content: 'hello' },
    { role: 'assistant', content: 'response-1' },
    { role: 'user', content: 'again' },
  ]);
  assert.match(output.text, /openclone conversation: Alice \(alice\)/);
});

test('manual /compact summarizes older turns and keeps recent messages', async () => {
  const chatCalls = [];
  const summaryPrompts = [];
  const output = new CaptureOutput();
  await runConversation({
    cloneLabel: 'Alice (alice)',
    model: {},
    system: 'system',
    tools: {},
    output,
    readline: fakeReadline(['one', 'two', '/compact', 'three', '/bye']),
    compactKeepTurns: 1,
    stream: async (options) => {
      if (options.system.includes('compact conversation history')) {
        summaryPrompts.push(options.messages[0].content);
        return 'summary of one';
      }
      chatCalls.push({
        system: options.system,
        messages: options.messages.map((message) => ({ role: message.role, content: message.content })),
      });
      options.onText?.(`response-${chatCalls.length}`);
      return `response-${chatCalls.length}`;
    },
  });

  assert.equal(summaryPrompts.length, 1);
  assert.match(summaryPrompts[0], /user: one/);
  assert.equal(chatCalls.length, 3);
  assert.match(chatCalls[2].system, /summary of one/);
  assert.deepEqual(chatCalls[2].messages, [
    { role: 'user', content: 'two' },
    { role: 'assistant', content: 'response-2' },
    { role: 'user', content: 'three' },
  ]);
  assert.match(output.text, /\[compacted 2 older message\(s\)\]/);
});

test('auto compaction triggers when history exceeds configured char threshold', async () => {
  const systems = [];
  const output = new CaptureOutput();
  await runConversation({
    cloneLabel: 'Alice (alice)',
    model: {},
    system: 'system',
    tools: {},
    output,
    readline: fakeReadline(['first long message', 'second long message', '/bye']),
    compactMaxChars: 20,
    compactKeepTurns: 1,
    stream: async (options) => {
      if (options.system.includes('compact conversation history')) return 'auto summary';
      systems.push(options.system);
      options.onText?.('ok');
      return 'ok';
    },
  });

  assert.equal(systems.length, 2);
  assert.match(systems[1], /auto summary/);
  assert.match(output.text, /\[auto-compacted 1 older message\(s\)\]/);
});

test('/clear removes both raw history and compacted summary', async () => {
  const chatCalls = [];
  const output = new CaptureOutput();
  await runConversation({
    cloneLabel: 'Alice (alice)',
    model: {},
    system: 'system',
    tools: {},
    output,
    readline: fakeReadline(['one', 'two', '/compact', '/clear', 'fresh', '/bye']),
    compactKeepTurns: 1,
    stream: async (options) => {
      if (options.system.includes('compact conversation history')) return 'summary before clear';
      chatCalls.push({
        system: options.system,
        messages: options.messages.map((message) => ({ role: message.role, content: message.content })),
      });
      options.onText?.('ok');
      return 'ok';
    },
  });

  assert.equal(chatCalls.at(-1).system, 'system');
  assert.deepEqual(chatCalls.at(-1).messages, [{ role: 'user', content: 'fresh' }]);
  assert.match(output.text, /Conversation history and summary cleared/);
});
