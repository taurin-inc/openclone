import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { render, Box, Text } from "ink";
import { FakeStdin, FakeStdout, joinedFrames, stripAnsi, tick } from "./ink-render.mjs";

test("ink-render harness captures output frames", async () => {
  const stdin = new FakeStdin();
  const stdout = new FakeStdout();
  const stderr = new FakeStdout();
  const tree = React.createElement(
    Box,
    { flexDirection: "column" },
    React.createElement(Text, null, "hello world"),
  );
  const instance = render(tree, {
    stdin,
    stdout,
    stderr,
    exitOnCtrlC: false,
    patchConsole: false,
    debug: false,
  });
  await tick(3);
  instance.unmount();
  await instance.waitUntilExit();
  const captured = stripAnsi(joinedFrames(stdout));
  assert.match(captured, /hello world/);
});
