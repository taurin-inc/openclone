import test from 'node:test';
import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import { parseConversationInput, runConversation, shouldStartInteractive } from '../dist/lib/conversation.js';

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

test('conversation command parser handles exit, clear, help, empty, and messages', () => {
  assert.deepEqual(parseConversationInput('/bye'), { kind: 'exit' });
  assert.deepEqual(parseConversationInput('/exit'), { kind: 'exit' });
  assert.deepEqual(parseConversationInput('/quit'), { kind: 'exit' });
  assert.deepEqual(parseConversationInput('/clear'), { kind: 'clear' });
  assert.deepEqual(parseConversationInput('/help'), { kind: 'help' });
  assert.deepEqual(parseConversationInput('   '), { kind: 'empty' });
  assert.deepEqual(parseConversationInput('hello'), { kind: 'message', text: 'hello' });
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
