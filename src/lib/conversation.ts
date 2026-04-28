import { createInterface, type Interface } from "node:readline/promises";
import { stdin as defaultInput, stdout as defaultOutput } from "node:process";
import type { Readable, Writable } from "node:stream";
import type { ModelMessage, ToolSet } from "ai";
import type { LanguageModel } from "ai";
import { streamChat } from "./stream-chat.js";

export interface InteractiveDecisionInput {
  explicitPrompt?: string;
  positionalPrompt?: string;
  stdinText?: string;
  stdinIsTTY?: boolean;
  stdoutIsTTY?: boolean;
}

export type ConversationCommand =
  | { kind: "exit" }
  | { kind: "clear" }
  | { kind: "help" }
  | { kind: "empty" }
  | { kind: "message"; text: string };

export interface ConversationOptions {
  cloneLabel: string;
  model: LanguageModel;
  system: string;
  tools: ToolSet;
  input?: Readable;
  output?: Writable;
  readline?: Interface;
  stream?: typeof streamChat;
}

export function shouldStartInteractive(input: InteractiveDecisionInput): boolean {
  return !input.explicitPrompt && !input.positionalPrompt && !input.stdinText
    && input.stdinIsTTY !== false && input.stdoutIsTTY !== false;
}

export function parseConversationInput(raw: string): ConversationCommand {
  const text = raw.trim();
  if (!text) return { kind: "empty" };
  const normalized = text.toLowerCase();
  if (normalized === "/bye" || normalized === "/exit" || normalized === "/quit") return { kind: "exit" };
  if (normalized === "/clear") return { kind: "clear" };
  if (normalized === "/help" || normalized === "?") return { kind: "help" };
  return { kind: "message", text: raw };
}

export function conversationHelp(): string {
  return [
    "Commands:",
    "  /help   Show this help",
    "  /clear  Clear in-memory conversation history",
    "  /bye    Exit (also /exit or /quit)",
  ].join("\n");
}

export async function runConversation(options: ConversationOptions): Promise<void> {
  const output = options.output ?? defaultOutput;
  const rl = options.readline ?? createInterface({
    input: options.input ?? defaultInput,
    output,
    terminal: Boolean((options.input ? false : defaultInput.isTTY) && (options.output ? false : defaultOutput.isTTY)),
  });
  const closeReadline = !options.readline;
  const stream = options.stream ?? streamChat;
  let messages: ModelMessage[] = [];

  output.write(`openclone conversation: ${options.cloneLabel}\n`);
  output.write(`${conversationHelp()}\n\n`);

  try {
    while (true) {
      let raw: string;
      try {
        raw = await rl.question(">>> ");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") break;
        throw error;
      }

      const command = parseConversationInput(raw);
      if (command.kind === "empty") continue;
      if (command.kind === "exit") break;
      if (command.kind === "help") {
        output.write(`${conversationHelp()}\n`);
        continue;
      }
      if (command.kind === "clear") {
        messages = [];
        output.write("Conversation history cleared.\n");
        continue;
      }

      messages.push({ role: "user", content: command.text });
      const response = await stream({
        model: options.model,
        system: options.system,
        messages,
        tools: options.tools,
        onText: (chunk) => output.write(chunk),
      });
      output.write("\n");
      messages.push({ role: "assistant", content: response });
    }
  } finally {
    if (closeReadline) rl.close();
  }
}
