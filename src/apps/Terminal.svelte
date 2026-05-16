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
<<<<<<< HEAD
  <span>shell™ for ctOS Scale 7.6.1 <TerminalWidget width="2">Hello</TerminalWidget> test text 2</span>
=======
  <span
    >shell™ for ctOS Scale 7.6.1 <TerminalWidget width="2"
      >Hello</TerminalWidget> test text 2</span>
>>>>>>> 7e7efdc644794d7009d81433de9d25d4e5191e27
</div>
