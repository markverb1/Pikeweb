import { SvelteMap } from "svelte/reactivity";
import { Process, type DataStream } from "../Process.svelte";

export interface PTYInfo {
  richText: boolean;
  editableOutput: boolean;
  stdout: boolean;
  stdin: boolean;
}

export abstract class PTYBase {
  public abstract readonly Info: PTYInfo;
  public prompt: string = $state("");
  protected _output: string = $state("");

  public get output() {
    return this._output;
  }

  public set output(value: string) {
    if (this.Info.editableOutput) this._output = value;
    else
      throw new Error(
        "Attempted to edit output of TTY which doesn't support it",
      );
  }

  private _fgProc?: Process;

  public get fgProc() {
    return this._fgProc;
  }

  public abstract handleStdout(data: DataStream, proc: Process): void;
  public abstract handleExit(code: number, proc: Process): void;

  private _unsubs = new SvelteMap<
    Process,
    {
      stdout?: () => void;
      exit?: () => void;
    }
  >();

  public foreground(
    proc: Process,
    substdout: boolean = true,
    unsubstdout: boolean = true,
  ) {
    if (proc.killed) return;
    this.background(unsubstdout);
    if (substdout) this.subStdout(proc);
    this.subExit(proc);
    this._fgProc = proc;
    proc.getForegrounded(this);
  }

  public background(unsubstdout: boolean = false) {
    if (this._fgProc == null) return;
    if (unsubstdout) this._unsubs.get(this._fgProc)?.stdout?.();
    this._fgProc.getBackgrounded(this);
    this._fgProc = undefined;
  }
  public writeStdin(data: DataStream) {
    this._fgProc?.receiveStdin(data);
  }

  public subStdout(proc: Process) {
    if (this._unsubs.get(proc)?.stdout != null)
      return this._unsubs.get(proc)?.stdout;
    const existing = this._unsubs.get(proc) ?? {};
    this._unsubs.set(proc, {
      ...existing,
      stdout: proc.onStdout((data) => {
        this.handleStdout(data, proc);
      }),
    });
  }

  // private _cleanup(proc: Process) {
  //   if (this._foregrounded === proc)
  // }

  public subExit(proc: Process) {
    if (this._unsubs.get(proc)?.exit != null)
      return this._unsubs.get(proc)?.exit;
    const existing = this._unsubs.get(proc) ?? {};
    this._unsubs.set(proc, {
      ...existing,
      exit: proc.onExit((data) => {
        this._exited(proc);
        this.handleExit(data, proc);
      }),
    });
  }

  private _exited(proc: Process) {
    const unsubs = this._unsubs.get(proc);
    unsubs?.stdout?.();
    unsubs?.exit?.();
    this._unsubs.delete(proc);
    if (this.fgProc === proc) {
      this.background();
      console.log("Foregrounding " + proc.parent?.program?.name);
      if (proc.parent != null) {
        this._unsubs.delete(proc.parent);
        this.foreground(proc.parent, true);
      }
    }
  }
}
