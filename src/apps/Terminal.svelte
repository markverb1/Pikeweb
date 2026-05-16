<script lang="ts">
  import TerminalWidget from "../lib/TerminalWidget.svelte";

  let focused = $state(false);

  export function onWinFocus() {
    focused = true;
  }

  export function onWinBlur() {
    focused = false;
  }
</script>

<div
  class="h-full w-full font-mono bg-term-background {focused
    ? 'text-term-foreground'
    : 'text-term-foreground-faded'}">
  <span
    >shell™ for ctOS Scale 7.6.1 <TerminalWidget width="2"
      >Hello</TerminalWidget> test text 2</span>
</div>
