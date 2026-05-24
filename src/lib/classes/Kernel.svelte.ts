import {
  Process,
  type DataStream,
  type StreamCallback,
} from "./Process.svelte";
import { Programs } from "./Programs.svelte";
import type { PTYBase } from "./base/PTY.svelte";

export interface Syscalls {
  stdout: (data: DataStream) => void;
  exit: (code?: number) => void;

  onStdout: (cb: StreamCallback) => () => void;
  onStdin: (cb: StreamCallback) => () => void;
  onForegrounded: (cb: (pty: PTYBase) => void) => () => void;
  onBackgrounded: (cb: (pty: PTYBase) => void) => () => void;
  onExit: (cb: (code: number) => void) => () => void;

  receiveStdin: (data: DataStream) => void;
  getForegrounded: (pty: PTYBase) => void;
  getBackgrounded: (pty: PTYBase) => void;

  runProgram: (args: string[], syscalls: Syscalls) => void;
  pipe: (other: Process) => Process;
  unpipe: (other: Process) => void;
  unpipeAll: () => void;

  getPTY: () => PTYBase | undefined;
  fg: (target: Process) => void;
  bg: () => void;

  spawn: () => Process;
  spawnArgs: (
    args: string[],
    ptyBase?: PTYBase,
    startProgram?: boolean,
  ) => Process | undefined;
}

export class Kernel {
  private _programs = import.meta.glob("./programs/*.ts", { eager: true });
  private _processes: Process[] = [];

  public get Processes(): Process[] {
    return this._processes;
  }

  private _generateSyscalls(proc: Process, pty?: PTYBase): Syscalls {
    return {
      stdout: (data) => {
        proc.stdout(data);
      },
      exit: (code?) => {
        proc.exit(code);
      },
      onStdout: (cb) => {
        return proc.onStdout(cb);
      },
      onStdin: (cb) => {
        return proc.onStdin(cb);
      },
      onForegrounded: (cb) => {
        return proc.onForegrounded(cb);
      },
      onBackgrounded: (cb) => {
        return proc.onBackgrounded(cb);
      },
      onExit: (cb) => {
        return proc.onExit(cb);
      },
      receiveStdin: (data) => {
        proc.receiveStdin(data);
      },
      getForegrounded: (pty) => {
        proc.getForegrounded(pty);
      },
      getBackgrounded: (pty) => {
        proc.getBackgrounded(pty);
      },
      runProgram: (args, syscalls) => {
        proc.runProgram(args, syscalls);
      },
      pipe: (other) => {
        return proc.pipe(other);
      },
      unpipe: (other) => {
        proc.unpipe(other);
      },
      unpipeAll: () => {
        proc.unpipeAll();
      },
      getPTY: () => {
        return pty;
      },
      fg: (target: Process) => {
        if (pty != null) pty.foreground(target);
      },
      bg: () => {
        if (pty != null) pty.background();
      },
      spawn: (): Process => {
        return this.spawn(proc);
      },
      spawnArgs: (
        args: string[],
        ptyBase?: PTYBase,
        startProgram: boolean = true,
      ): Process | undefined => {
        if (ptyBase == null && pty != null) ptyBase = pty;
        return this.spawnArgs(args, proc, ptyBase, startProgram);
      },
    };
  }

  public spawn(parent?: Process, pty?: PTYBase): Process {
    const proc = new Process(parent);
    proc.syscalls = this._generateSyscalls(proc, pty);
    this._processes.push(proc);
    return proc;
  }

  public spawnArgs(
    args: string[],
    parent?: Process,
    pty?: PTYBase,
    startProgram: boolean = true,
  ): Process | undefined {
    const prg = Programs[args[0]];
    if (prg == null) return undefined;
    const proc = new Process(parent);
    proc.syscalls = this._generateSyscalls(proc, pty);
    this._processes.push(proc);
    proc.program = prg;
    if (startProgram) proc.runProgram(args, proc.syscalls);
    return proc;
  }
}
