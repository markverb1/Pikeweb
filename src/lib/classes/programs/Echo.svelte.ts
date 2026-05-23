// programs/Echo.ts
import Program from "../base/Program.svelte";
import type { Syscalls } from "../Kernel.svelte";
import { createStdio } from "../../libraries/Stdio.svelte";

export default new (class Echo extends Program {
  readonly name = "echo";
  readonly options = {
    desc: "Print arguments to stdout",
    version: "1.0.0",
  };

  main(args: string[], sys: Syscalls): number {
    const io = createStdio(sys);
    if (args.length < 2) {
      io.print("echo: missing arguments", true);
      return 1;
    }
    io.print(args.slice(1).join(" "));
    return 0;
  }
})();
