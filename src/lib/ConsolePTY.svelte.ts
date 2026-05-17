import type { Process } from "./Process.svelte";
import { PTYBase } from "./PTY.svelte";

export class ConsolePTY extends PTYBase {
  onStdout(data: string): void {
    console.log(data);
  }
  onStderr(data: string): void {
    console.error(data);
  }
  onExit(proc: Process, code: number): void {
    console.log(`[process ${proc.pid} exited with code ${code}]`);
  }
}
