<script lang="ts">
  import { onMount } from "svelte";
  import { Terminal } from "@xterm/xterm";
  import { WebglAddon } from "@xterm/addon-webgl";
  import { FitAddon } from "@xterm/addon-fit";
  import "@xterm/xterm/css/xterm.css";

  import type { ClassValue } from "svelte/elements";
  const props: { class?: ClassValue } = $props();

  let terminalEl: HTMLDivElement;
  let term: Terminal;
  let webgl: WebglAddon;
  let observer: ResizeObserver;

  function setupInput() {
    term.onKey(({ key, domEvent }) => {
      const domKey = domEvent.key;
      if (domKey.length === 1) {
        term.write(key);
        return;
      }
      switch (domKey) {
        case "Backspace":
          term.write("\b \b");
          break;
      }
    });
  }

  onMount(async () => {
    await document.fonts.ready;

    term = new Terminal({
      theme: {
        background: "#282828",
        foreground: "#ebdbb2",
      },
      fontFamily: "'Fira Code', monospace",
      fontSize: 14.8,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalEl);
    webgl = new WebglAddon();
    term.loadAddon(webgl);

    observer = new ResizeObserver((entries) => {
      fitAddon.fit();
    });
    observer.observe(terminalEl);

    fitAddon.fit();
    term.writeln("shell™ for ctOS Scale 7.6.1");
    term.writeln("Copyright (C) Bitwise Laboratories. All rights reserved.");

    setupInput();
  });
</script>

<div bind:this={terminalEl} class={["h-full bg-[#282828]", props.class]}></div>
