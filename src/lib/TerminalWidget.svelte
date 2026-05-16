<script lang="ts">
  let { width, children = null, offset = 0, overlay = true } = $props();
</script>

<span
  style={overlay ? `width:${width}ch;left:${offset}ch` : ''}
  class="h-lh font-mono text-[1em] {overlay
    ? 'absolute overflow-hidden'
    : 'relative inline-block align-bottom w-0'}">
  {@render children?.()}
</span>
