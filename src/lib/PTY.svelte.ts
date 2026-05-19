import { Process } from "./Process.svelte";

export interface PTYInfo {
  richtext: boolean;
  editableOutput: boolean;
  stdout: boolean;
  stdin: boolean;
  stderr: boolean;
}

export class PTYBase {
  process: Process | null = null;
  ptyinfo: PTYInfo = {
    richtext: true,
    editableOutput: true,
    stdout: true,
    stdin: true,
    stderr: true,
  };

  outputting: Process[] = [];
  foregrounded: Process | null = null;

  // Store unsubscribe functions per process
  private _unsubs = new Map<
    Process,
    {
      stdout: (() => void) | null;
      stderr: (() => void) | null;
      exit: (() => void) | null;
    }
  >();

  onStdout(data: string) {}
  onStderr(data: string) {}
  onExit(proc: Process, code: number) {}

  writeStdin(data: string) {
    this.foregrounded?.receiveStdin(data);
  }

  get isLocked(): boolean {
    return this.foregrounded !== null;
  }

  foreground(proc?: Process, unsubstdout: boolean = true, unsubstderr: boolean = true) {
    if (proc == null) return;
    this.background(unsubstdout,unsubstderr)
    this.foregrounded = proc;
    if (!this.outputting.includes(proc)) this.outputting.push(proc);
    

    const unsubStdout = proc.onStdout((data) => this.onStdout(data));
    const unsubStderr = proc.onStderr((data) => this.onStderr(data));
    const unsubExit = proc.onExit((code) => {
      this._cleanup(proc);
      this.onExit(proc, code);
    });

    this._unsubs.set(proc, {
      stdout: unsubStdout,
      stderr: unsubStderr,
      exit: unsubExit,
    });
  }

  background(unsubStdout: boolean = false, unsubStderr: boolean = false) {
    const proc = this.foregrounded;
    if (proc == null) return;

    this.foregrounded = null;
    const unsubs = this._unsubs.get(proc);
    if (!unsubs) return;

    if (unsubStdout) {
      unsubs.stdout?.();
      unsubs.stdout = null;
    }
    if (unsubStderr) {
      unsubs.stderr?.();
      unsubs.stderr = null;
    }
    if (proc.parent != null) this.foreground(proc.parent);
  }

  private _cleanup(proc: Process) {
    const unsubs = this._unsubs.get(proc);
    unsubs?.stdout?.();
    unsubs?.stderr?.();
    unsubs?.exit?.();
    this._unsubs.delete(proc);
    this.outputting = this.outputting.filter((p) => p !== proc);
    if (this.foregrounded === proc) this.foregrounded = null;
    if (proc.parent != null) this.foreground(proc.parent,true,true);
  }

  subscribeToStdout(proc?: Process) {
    if (proc == null) return;
    const unsub = proc.onStdout((data) => this.onStdout(data));
    const existing = this._unsubs.get(proc) ?? {
      stdout: null,
      stderr: null,
      exit: null,
    };
    this._unsubs.set(proc, { ...existing, stdout: unsub });
    this.outputting.push(proc);
  }

  subscribeToStderr(proc?: Process) {
    if (proc == null) return;
    const unsub = proc.onStderr((data) => this.onStdout(data));
    const existing = this._unsubs.get(proc) ?? {
      stdout: null,
      stderr: null,
      exit: null,
    };
    this._unsubs.set(proc, { ...existing, stderr: unsub });
    this.outputting.push(proc);
  }
}
