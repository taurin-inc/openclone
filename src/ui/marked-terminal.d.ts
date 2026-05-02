declare module "marked-terminal" {
  import type { MarkedExtension } from "marked";
  export interface MarkedTerminalOptions {
    reflowText?: boolean;
    unescape?: boolean;
    emoji?: boolean;
    tab?: number;
    width?: number;
    showSectionPrefix?: boolean;
    [key: string]: unknown;
  }
  export function markedTerminal(options?: MarkedTerminalOptions, highlightOptions?: unknown): MarkedExtension;
  export default markedTerminal;
}
