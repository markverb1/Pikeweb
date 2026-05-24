<script lang="ts">
  const {
    author = "",
    children,
    authorColor = "",
    messageColor = "",
  } = $props();
</script>

<div>
  <span style={authorColor ? `color:${authorColor}` : ""}>{author}</span
  >&nbsp;<span style={messageColor ? `color:${messageColor}` : ""}
    >{@render children()}</span>
</div>
