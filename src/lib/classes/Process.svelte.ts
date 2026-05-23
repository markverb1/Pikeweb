import { WriteOnceBool } from "./WriteOnceBool.svelte";
import type { PTYBase } from "./base/PTY.svelte";
import type Program from "./base/Program.svelte";
import type { Syscalls } from "./Kernel.svelte";

export interface DataStream {
  text: string;
  isError: boolean;
  obj: object;
}

export type StreamCallback = (data: DataStream) => void;

export class Process {
  public PTY?: PTYBase;
  public parent?: Process;
  public program?: Program;
  public syscalls?: Syscalls;
  private _programRunning = new WriteOnceBool();
  public get programRunning() {
    return this._programRunning;
  }
  private _stdoutCbs: StreamCallback[] = [];
  private _stdinCbs: StreamCallback[] = [];
  private _exitCbs: ((code: number) => void)[] = [];
  private _fgCbs: ((pty: PTYBase) => {})[] = [];
  private _bgCbs: ((pty: PTYBase) => {})[] = [];

  private _killed = new WriteOnceBool();
  private _pipes = new Map<Process, () => void>();

  // constructor(syscalls?: Syscalls, program?: Program) {
  //   if (syscalls) this.syscalls = syscalls;
  //   if (program) this.program = program;
  // }
  constructor(parent?: Process) {
    this.parent = parent;
  }

  get killed() {
    return this._killed.value;
  }

  stdout(data: DataStream): void {
    if (!this._killed.value) this._stdoutCbs.forEach((cb) => cb(data));
  }

  public onStdout(cb: StreamCallback): () => void {
    this._stdoutCbs.push(cb);
    return () => {
      const i = this._stdoutCbs.indexOf(cb);
      if (i !== -1) this._stdoutCbs.splice(i, 1);
    };
  }

  public onStdin(cb: StreamCallback): () => void {
    this._stdinCbs.push(cb);
    return () => {
      this._stdinCbs = this._stdinCbs.filter((c) => c !== cb);
    };
  }

  public onForegrounded(cb: (pty: PTYBase) => {}) {
    this._fgCbs.push(cb);
    return () => {
      this._fgCbs = this._fgCbs.filter((c) => c !== cb);
    };
  }

  public onBackgrounded(cb: (pty: PTYBase) => {}) {
    this._bgCbs.push(cb);
    return () => {
      this._bgCbs = this._bgCbs.filter((c) => c !== cb);
    };
  }

  public receiveStdin(data: DataStream) {
    if (!this._killed.value) this._stdinCbs.forEach((cb) => cb(data));
  }

  public getForegrounded(pty: PTYBase) {
    if (!this._killed.value) this._fgCbs.forEach((cb) => cb(pty));
  }

  public getBackgrounded(pty: PTYBase) {
    if (!this._killed.value) this._bgCbs.forEach((cb) => cb(pty));
  }

  public onExit(cb: (code: number) => void): () => void {
    this._exitCbs.push(cb);
    return () => {
      this._exitCbs = this._exitCbs.filter((c) => c !== cb);
    };
  }

  public runProgram(args: string[], syscalls: Syscalls) {
    if (this.program == null) return;
    if (this._programRunning.value) return;
    this._programRunning.value = true;
    this.program.run(args, syscalls);
  }

  public pipe(other: Process): Process {
    if (this._pipes.has(other)) return other;
    const unsub = this.onStdout((data) => other.receiveStdin(data));
    this._pipes.set(other, unsub);
    return other;
  }

  public unpipe(other: Process): void {
    this._pipes.get(other)?.();
    this._pipes.delete(other);
  }

  public unpipeAll(): void {
    this._pipes.forEach((unsub) => unsub());
    this._pipes.clear();
  }

  public exit(code: number = 0): void {
    if (this._killed.value) return;
    this._killed.value = true;
    this.unpipeAll();
    this._exitCbs.forEach((cb) => cb(code));
  }
}
