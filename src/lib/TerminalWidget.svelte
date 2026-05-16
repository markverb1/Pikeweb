<script lang="ts">
  let { width, children = null, offset = 0, overlay = true } = $props();
</script>

<span
  style="width:{width}ch;left:{offset}ch"
  class="h-lh font-mono overflow-hidden text-[1em] {overlay
    ? 'absolute'
    : 'inline-block align-bottom relative'}">
  {@render children?.()}
</span>
