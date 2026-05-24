<script lang="ts">
  import IRCMessage from "../templates/IRCMessage.svelte";
  let pre: HTMLPreElement;
  //let inputEl: HTMLInputElement;
  let output = "";

  function escape(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
</script>

<div
  class="flex h-full w-full flex-col p-1 min-h-0 grow overflow-y-auto text-wrap wrap-anywhere bg-neutral">
  <IRCMessage author="Plusk:" authorColor="#A400A4"
    >I love snorting cocaine and blowing up datacenters :3c</IRCMessage>
</div>
