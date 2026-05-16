<script lang="ts">
  import TerminalWidget from "../lib/TerminalWidget.svelte";
  import TerminalCursor from "../lib/TerminalCursor.svelte";

  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  let focused = $state(false);
  let offset = $state(0);
  let cursor: TerminalCursor;

  export function onWinFocus() {
    focused = true;
  }

  export function onWinBlur() {
    focused = false;
  }
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  document.addEventListener("keydown", async (ev) => {
    if (!focused) return;
    const key = ev.key;
    cursor.stopAnimation();
    sleep(1000).then(() => cursor.startAnimation());
    switch (key) {
      case "ArrowLeft":
        offset -= 1;
        break;
      case "ArrowRight":
        offset += 1;
        break;
    }
    offset = clamp(offset, 0, Infinity);
  });
</script>

<div
  class="h-full w-full font-mono bg-term-background {focused
    ? 'text-term-foreground'
    : 'text-term-foreground-faded'}">
  <span>
    <TerminalCursor bind:this={cursor} {offset} />
    shell™ for ctOS Scale 7.6.1 test text 2
  </span>
</div>
