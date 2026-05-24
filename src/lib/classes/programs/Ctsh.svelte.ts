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
    let prompt = $state("Sh>");
    const io = createStdio(sys);
    // prettier-ignore
    io.print(
`     ╔═╗┬ ┬┌─┐┬  ┬   CT
┌─┌┬┐╚═╗├─┤├┤ │  │   SHELL
└─ ┴ ╚═╝┴ ┴└─┘┴─┘┴─┘ 1.6.0`,
    );
    return new Promise((resolve) => {
      sys.setPrompt(prompt);
      sys.onStdin(async (data) => {
        console.log("> " + data.text);
        io.print(
          `\n<span class="text-base-content/50">${prompt}${data.text}</span>\n`,
        );
        if (data.text == "exit") {
          resolve(0);
        }
        if (sys.getPTY() != null) {
          console.log("backgrounded ctsh");
          prompt = "";
          sys.setPrompt(prompt);
          const nuproc = sys.spawnArgs(data.text.split(" "), undefined, false);
          if (nuproc == undefined) io.print("Unknown command", true);
          else {
            sys.fg(nuproc);
            nuproc.runProgram(data.text.split(" "), nuproc.syscalls!);
          }
        }
      });
      sys.onForegrounded(() => {
        sys.setPrompt(prompt);
      });
    });
  }
})();
