import type { PTYBase } from "./PTY.svelte";
export type ProcCallback = (data: string) => void;

export class Process {
  public PTY: PTYBase | null = null;
  public readonly pid: number;
  public readonly parent: Process | null = null;

  private static _nextPid = 1;
  private _killed = false;
  private _stdoutCbs: ProcCallback[] = [];
  private _stderrCbs: ProcCallback[] = [];
  private _exitCbs: ((code: number) => void)[] = [];

  constructor(parentProc?: Process) {
    this.pid = Process._nextPid++;
    if (parentProc != null) this.parent = parentProc;
  }

  onStdout(cb: ProcCallback): () => void {
    this._stdoutCbs.push(cb);
    return () => {
      this._stdoutCbs = this._stdoutCbs.filter((c) => c !== cb);
    };
  }

  onStderr(cb: ProcCallback): () => void {
    this._stderrCbs.push(cb);
    return () => {
      this._stderrCbs = this._stderrCbs.filter((c) => c !== cb);
    };
  }

  onExit(cb: (code: number) => void): () => void {
    this._exitCbs.push(cb);
    return () => {
      this._exitCbs = this._exitCbs.filter((c) => c !== cb);
    };
  }

  stdout(data: string): void {
    if (!this._killed) this._stdoutCbs.forEach((cb) => cb(data));
  }

  stderr(data: string): void {
    if (!this._killed) this._stderrCbs.forEach((cb) => cb(data));
  }

  exit(code: number = 0): void {
    this._killed = true;
    this._exitCbs.forEach((cb) => cb(code));
  }

  kill() {
    this.exit(143);
  }

  get killed() {
    return this._killed;
  }

  get isAPTY(): boolean {
    return this.PTY != null;
  }

  pipe(other: Process): () => void {
    return this.onStdout((data) => other.receiveStdin(data));
  }

  // stdin is private - only PTY or pipes can write to it
  private _stdinCbs: ProcCallback[] = [];
  /** @internal */ onStdin(cb: ProcCallback): () => void {
    this._stdinCbs.push(cb);
    return () => {
      this._stdinCbs = this._stdinCbs.filter((c) => c !== cb);
    };
  }

  /** @internal */ receiveStdin(data: string) {
    if (!this._killed) this._stdinCbs.forEach((cb) => cb(data));
    console.log(data)
  }
}
