export type ProcCallback = (data: string) => void;

export class Process {
  public blocking = true;
  public readonly pid: number;
  private static _nextPid = 1;
  private _killed = false;
  private _stdoutCbs: ProcCallback[] = [];
  private _stderrCbs: ProcCallback[] = [];
  private _exitCbs: ((code: number) => void)[] = [];

  constructor() {
    this.pid = Process._nextPid++;
  }

  // stdout/stderr stay on Process, program decides when to emit
  onStdout(cb: ProcCallback): this {
    this._stdoutCbs.push(cb);
    return this;
  }
  onStderr(cb: ProcCallback): this {
    this._stderrCbs.push(cb);
    return this;
  }
  onExit(cb: (code: number) => void): this {
    this._exitCbs.push(cb);
    return this;
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

  pipe(other: Process) {
    this.onStdout((data) => other.receiveStdin(data));
    return other;
  }

  // stdin is private - only PTY or pipes can write to it
  private _stdinCbs: ProcCallback[] = [];

  /** @internal */ onStdin(cb: ProcCallback) {
    this._stdinCbs.push(cb);
    return this;
  }

  /** @internal */ receiveStdin(data: string) {
    if (!this._killed) this._stdinCbs.forEach((cb) => cb(data));
  }
}
