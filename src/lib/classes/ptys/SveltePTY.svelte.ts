import type { DataStream } from "../Process.svelte";
import { PTYBase, type PTYInfo } from "../base/PTY.svelte";

export class SveltePTY extends PTYBase {
  public Info: PTYInfo = {
    richText: true,
    editableOutput: true,
    stdout: true,
    stdin: true,
  };

  public handleStdout(data: DataStream): void {
    console.log(data.text);
    if (!data.isError) this._output += data.text;
    else
      this._output += `<span class="text-term-red-intense font-bold bg-term-black">${data.text}</span>`;
  }

  public handleExit(): void {}
}
