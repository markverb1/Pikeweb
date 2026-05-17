<script lang="ts">
  import { onMount, mount } from "svelte";
  import Terminal from "./apps/Terminal.svelte";
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
      props: {},
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

  let programs: Record<string, (args: string[], proc: Process) => void> = {
    testcmd: (args: string[], proc: Process) => {
      proc.stdout("Test");
      proc.stderr("This is an error");
      proc.exit();
    },
  };

  function startProcess(args: string[], pty?: PTYBase): Process | undefined {
    if (args.length < 1) return;
    let prg = programs[args[0]];
    if (prg == null) return;
    const proc = new Process();
    if (pty != null) pty.foreground(proc);
    prg(args, proc);
    return proc;
  }

  let pty = new ConsolePTY();
  startProcess(["testcmd"], pty);
</script>

<div></div>
<Icon
  icon="/icons/terminal.svg"
  name="Terminal"
  width="64"
  height="64"
  ondblclick={openWindow} />

<!-- <div class="flex h-full"><CTerminal class="grow flex-1" /></div> -->
