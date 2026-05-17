import { PTYBase } from "./PTY.svelte";

export class SveltePTY extends PTYBase {
  public output = $state("");
  onStdout(data: string): void {
    this.output += data;
  }
  onStderr(data: string): void {
    this.output += `<span class="text-term-red-intense">${data}</span>`;
  }
}
