import React from "react";
import { Text } from "ink";
import { Markdown } from "./Markdown.js";

export type MessageItem =
  | { kind: "user"; text: string }
  | { kind: "assistant"; text: string }
  | { kind: "system"; text: string };

export function MessageView({ item }: { item: MessageItem }): React.JSX.Element {
  if (item.kind === "user") {
    return <Text>{`>>> ${item.text}`}</Text>;
  }
  if (item.kind === "assistant") {
    return <Markdown text={item.text} />;
  }
  return <Text>{item.text}</Text>;
}
