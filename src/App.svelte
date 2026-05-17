<script lang="ts">
  import { onMount, mount, setContext } from "svelte";
  import Terminal from "./apps/TerminalPTY.svelte";
  import Icon from "./templates/Icon.svelte";
  import WinBox from "winbox/src/js/winbox.js";
  import { Process } from "./lib/Process.svelte";
  import { PTYBase } from "./lib/PTY.svelte";
  import { ConsolePTY } from "./lib/ConsolePTY.svelte";

  onMount(() => {
    console.log("Piker Alpha");
    let stack = WinBox.stack();
    stack.forEach((v, i, arr) => {
      v.close(true);
    });
  });

  function openWindow() {
    const container = document.createElement("div");
    container.style = "height:100%;width:100%;";

    // Mount Svelte component into it
    const instance = mount(Terminal, {
      target: container,
      props: { startProcess: startProcess },
    });

    // Pass the container to WinBox via `mount`
    new WinBox("Terminal", {
      mount: container,
      width: 9 * 80, // 80 cols (one letter can occupy 9px at most)
      height: 300,
      icon: `${import.meta.env.BASE_URL}/icons/terminal.svg`,
      // onfocus() {
      //   instance.onWinFocus();
      // },
      // onblur() {
      //   instance.onWinBlur();
      // },
    });
  }

  let programs: Record<
    string,
    (args: string[], proc: Process, pty?: PTYBase) => void
  > = {
    testcmd: (args: string[], proc: Process) => {
      proc.stdout("Test");
      proc.stderr("This is an error");
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

  function startProcess(args: string[], pty?: PTYBase): Process | undefined {
    if (args.length < 1) return;
    let prg = programs[args[0]];
    if (prg == null) return;
    const proc = new Process();
    if (pty != null) pty.foreground(proc);
    prg(args, proc, pty);
    return proc;
  }
</script>

<div></div>
<Icon
  icon="/icons/terminal.svg"
  name="Terminal"
  width="64"
  height="64"
  ondblclick={openWindow} />

<!-- <div class="flex h-full"><CTerminal class="grow flex-1" /></div> -->
