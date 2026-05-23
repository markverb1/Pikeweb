import type { Syscalls } from "../Kernel.svelte";

interface ProgramOptions {
  ramCost?: number;
  size?: number;
  desc?: string;
  version?: string;
  author?: string;
  tags?: string[];
}

abstract class Program {
  public abstract readonly name: string;
  public abstract readonly options: ProgramOptions;

  public run(args: string[], sys: Syscalls): void {
    const result = this.main(args, sys);
    if (result instanceof Promise) {
      result.then((code) => sys.exit(code));
    } else {
      sys.exit(result);
    }
  }

  public abstract main(args: string[], sys: Syscalls): number | Promise<number>;
}

export default Program;
