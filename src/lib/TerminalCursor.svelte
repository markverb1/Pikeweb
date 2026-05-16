<script lang="ts">
  import { onMount } from "svelte";
  import TerminalWidget from "./TerminalWidget.svelte";

  let widget: HTMLDivElement;
  let widgetAnim: Animation;
  let { offset = 0 } = $props();

  onMount(() => {
    widgetAnim = widget.animate(
      [
        { opacity: 1, offset: 0, easing: "step-end" }, // 0%
        { opacity: 0, offset: 0.5, easing: "step-end" }, // 50%
        { opacity: 1, offset: 1 }, // 100%
      ],
      {
        duration: 1000,
        iterations: Infinity,
      },
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

<TerminalWidget width="1" {offset} overlay={true}>
  <div
    bind:this={widget}
    id="widget"
    class="w-1 h-full align-middle box-border border-l-2 border-l-term-foreground-intense">
  </div>
</TerminalWidget>

<!-- <style>
  #widget {
    animation: 1s blink step-end infinite;
  }
  @keyframes blink {
    from,
    to {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }
</style> -->
