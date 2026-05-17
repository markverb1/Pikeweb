import { Process } from "./Process.svelte";

export class PTYBase {
  // Attached process
  process: Process | null = null;
  // Processes which redirect their stdout to this terminal
  outputting: Process[] = [];
  supportsStdin: boolean = false;

  onStdout(data: string) {}
  onStderr(data: string) {}
  onExit(proc: Process, code: number) {}

  writeStdin(data: string) {
    // only blocking foregrounded processes get stdin
    this.outputting
      .filter((p) => p.blocking)
      .forEach((p) => p.receiveStdin(data));
  }

  foreground(proc?: Process) {
    if (proc == null) return;
    this.outputting.push(proc);
    proc.onStdout((data) => this.onStdout(data));
    proc.onStderr((data) => this.onStderr(data));
    proc.onExit((code) => {
      this.outputting = this.outputting.filter((p) => p !== proc);
      this.onExit(proc,code);
    });
  }

  subscribeToStdout(proc?: Process) {
    if (proc == null) return;
    proc.onStdout((data) => this.onStdout(data));
    this.outputting.push(proc);
  }

  subscribeToStderr(proc?: Process) {
    if (proc == null) return;
    proc.onStderr((data) => this.onStdout(data));
    this.outputting.push(proc);
  }

  get isLocked(): boolean {
    return this.outputting.some((proc) => proc.blocking);
  }
}
