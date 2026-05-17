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
    proc.stdout(
      '<span style="font-variant: all-small-caps;" class="font-medium">CT</span>SHELL v1.0.2\n',
    );
    proc.onStdin((data) => {
      proc.stdout(
        `\n<span class="text-base-content/50">${prompt}${data}</span>\n`,
      );
      if (pty != null) {
        if (startProcess(data.split(" "), pty) == undefined)
          proc.stderr("Unknown command");
      }
    });
  },
};

export function startProcess(
  args: string[],
  pty?: PTYBase,
): Process | undefined {
  if (args.length < 1) return;
  let prg = programs[args[0]];
  if (prg == null) return;
  const proc = new Process();
  if (pty != null) pty.foreground(proc);
  prg(args, proc, pty);
  return proc;
}
