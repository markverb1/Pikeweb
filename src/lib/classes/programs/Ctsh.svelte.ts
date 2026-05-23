import Program from "../base/Program.svelte";
import type { Syscalls } from "../Kernel.svelte";
import { createStdio } from "../../libraries/Stdio.svelte";

export default new (class Ctsh extends Program {
  readonly name = "ctsh";
  readonly options = {
    desc: "ctOS Shell",
    version: "1.0.0",
  };

  main(args: string[], sys: Syscalls): Promise<number> {
    const io = createStdio(sys);
    io.print(
      ` ___(  / _ // ctShell 
( /__)/)(-((  v1.0.3`,
    );
    return new Promise((resolve) => {
      let prompt = $state("Sh>");
      // prettier-ignore

      sys.onStdin(async (data) => {
        console.log("> " + data.text);
        io.print(
          `\n<span class="text-base-content/50">${prompt}${data.text}</span>\n`,
        );
        if (sys.getPTY() != null) {
          console.log("backgrounded ctsh");
          let nuproc = sys.spawnArgs(data.text.split(" "), undefined, false);
          if (nuproc == undefined) io.print("Unknown command", true);
          else {
            sys.fg(nuproc);
            nuproc.runProgram(data.text.split(" "), nuproc.syscalls!);
          }
        }
      });
    });
  }
})();
