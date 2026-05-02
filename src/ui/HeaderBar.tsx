import React from "react";
import { Box, Text } from "ink";

export interface HeaderBarProps {
  cloneLabel: string;
  modelLabel?: string;
  sessionLabel?: string;
}

export function HeaderBar({ cloneLabel, modelLabel, sessionLabel }: HeaderBarProps): React.JSX.Element {
  const segments: string[] = [cloneLabel];
  if (modelLabel) segments.push(modelLabel);
  if (sessionLabel) segments.push(sessionLabel);
  return (
    <Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1}>
      <Text color="cyan" bold>openclone</Text>
      <Text color="gray"> · </Text>
      <Text>{segments.join("  ·  ")}</Text>
    </Box>
  );
}
