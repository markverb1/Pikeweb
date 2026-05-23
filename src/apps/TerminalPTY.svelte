<script lang="ts">
  import { onMount } from "svelte";
  //import { startProcess } from "../lib/Programs.svelte";
  import { SveltePTY } from "../lib/classes/ptys/SveltePTY.svelte";
  import { Kernel } from "../lib/classes/Kernel.svelte";

  let prompt = $state("Sh>");
  let pty = new SveltePTY();
  let kernel = new Kernel();
  let pre: HTMLPreElement;
  let inputEl: HTMLInputElement;
  let wasAtBottom = false;

  function escape(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function isScrolledToBottom(el: HTMLElement): boolean {
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 2;
  }

  function onkeydown(ev: KeyboardEvent) {
    if (ev.key == "Enter") {
      pty.writeStdin({ text: escape(inputEl.value), isError: false, obj: {} });
      inputEl.value = "";
    }
  }

  $effect.pre(() => {
    pty.output; // track dependency
    if (pre) wasAtBottom = isScrolledToBottom(pre);
  });

  $effect(() => {
    pty.output;
    if (wasAtBottom) pre.scrollTop = pre.scrollHeight;
  });

  onMount(() => {
    const proc = kernel.spawnArgs(["ctsh"], undefined, pty, false);
    console.log(proc);
    if (!proc) return;
    pty.foreground(proc, true);
    proc.runProgram(["ctsh"], proc.syscalls!);
  });
</script>

<div class="flex h-full w-full flex-col bg-[#474747] p-1 text-green-400">
  <pre
    bind:this={pre}
    class="min-h-0 grow overflow-y-auto text-wrap wrap-anywhere">{@html pty.output}</pre>
  <label
    class="flex h-(--size) w-full shrink-0 items-center gap-2 border-t-2 border-t-black font-mono">
    <span class="text-base-content/50 select-none">{prompt}</span>
    <input
      bind:this={inputEl}
      type="text"
      class="grow bg-none outline-none"
      placeholder=""
      {onkeydown} />
  </label>
</div>
