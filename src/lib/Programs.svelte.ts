import { Process } from "./Process.svelte";
import type { PTYBase } from "./PTY.svelte";

export const programs: Record<
  string,
  (args: string[], proc: Process, pty?: PTYBase) => void
> = {
  testcmd: (args: string[], proc: Process) => {
    proc.stdout("Test");
    proc.stderr("This is an error");
    proc.exit();
  },
  echo: (args: string[], proc: Process) => {
    proc.stdout(args.slice(1).join(" "));
    proc.exit();
  },
  lolcat: (args: string[], proc: Process) => {
    proc.stdout(
      `<span style="background: linear-gradient(to right, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${args.slice(1).join(" ")}</span>`,
    );
    proc.exit();
  },
  help: (args: string[], proc: Process) => {
    proc.stdout(
      'wrtie &lt;script&gt; alert("Inject sql SELECT USERS PASSWORD or something idk im not a hacker")&lt;/script&gt;',
    );
    proc.exit();
  },
  ctsh: (args: string[], proc: Process, pty?: PTYBase) => {
    let prompt = $state("Sh>");
    // prettier-ignore
    proc.stdout(
      
` ___(  / _ // ctShell 
( /__)/)(-((  v1.0.3`,
    );
    proc.onStdin(async (data) => {
      console.log("recieve stdin")
      proc.stdout(
        `\n<span class="text-base-content/50">${prompt}${data}</span>\n`,
      );
      if (pty != null) {
        console.log("backgrounded ctsh");
        let nuproc = startProcess(data.split(" "), pty, proc);
        if (nuproc == undefined) proc.stderr("Unknown command");
        // nuproc?.onExit((code) => {
        //   console.log("test");
        //   pty.foreground(proc);
        //   console.log("foregrounded ctsh");
        // });
      }
    });
  },
};

export function startProcess(
  args: string[],
  pty?: PTYBase,
  parent?: Process,
): Process | undefined {
  if (args.length < 1) return;
  let prg = programs[args[0]];
  if (prg == null) return;
  const proc = new Process(parent);
  if (pty != null) pty.foreground(proc);
  // if (returnProc != null)
  //   proc.onExit(() => {
  //     pty?.foreground(returnProc);
  //   });
  prg(args, proc, pty);
  return proc;
}
