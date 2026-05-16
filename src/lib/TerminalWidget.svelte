<script lang="ts">
  let { width, children = null, offset = 0, overlay = true } = $props();
</script>

<span
  style="width:{width}ch;left:{offset}ch"
  class="h-lh overflow-hidden font-mono text-[1em] {overlay
    ? 'absolute'
    : 'relative inline-block align-bottom'}">
  {@render children?.()}
</span>
