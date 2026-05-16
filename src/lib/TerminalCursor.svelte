<script lang="ts">
  import { onMount } from "svelte";
  import TerminalWidget from "./TerminalWidget.svelte";

  let widget: HTMLDivElement;
  let widgetAnim: Animation;
  let { offset = 0 } = $props();

  $effect(() => {
    if (!widget) return;
    widgetAnim = widget.animate(
      [
        { opacity: 1, offset: 0, easing: "step-end" },
        { opacity: 0, offset: 0.5, easing: "step-end" },
        { opacity: 1, offset: 1 },
      ],
      { duration: 1000, iterations: Infinity },
    );
  });

  export function startAnimation() {
    if (widget == null) return;
    widgetAnim.currentTime = 0;
    widgetAnim.play();
  }

  export function stopAnimation() {
    if (widget == null) return;
    widgetAnim.currentTime = 0;
    widgetAnim.pause();
  }
</script>

<TerminalWidget width="1" {offset} overlay={false}>
  <div
    bind:this={widget}
    class="border-l-term-foreground-intense absolute top-0 left-0 box-border h-full w-1 border-l-2">
  </div>
</TerminalWidget>
