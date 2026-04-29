import React from "react";
import { Text } from "ink";
import { Marked } from "marked";
import { markedTerminal } from "marked-terminal";

const renderer = new Marked({ gfm: true, breaks: false });
renderer.use(markedTerminal({
  reflowText: false,
  unescape: true,
  emoji: false,
  tab: 2,
}) as Parameters<Marked["use"]>[0]);

export function renderMarkdown(text: string): string {
  if (!text) return "";
  try {
    const parsed = renderer.parse(text, { async: false });
    return typeof parsed === "string" ? parsed.replace(/\n+$/u, "") : text;
  } catch {
    return text;
  }
}

export function Markdown({ text }: { text: string }): React.JSX.Element {
  const rendered = renderMarkdown(text);
  return <Text>{rendered}</Text>;
}
