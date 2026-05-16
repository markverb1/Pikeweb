<script lang="ts">
  let { width, children = null } = $props();
</script>

<span style="width:{width}ch;" class="h-lh inline-block"
  >{@render children?.()}</span>
