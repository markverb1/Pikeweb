<script>
  import { onMount } from "svelte";
  import CTerminal from "./apps/CTerminal.svelte";
  import Icon from "./templates/Icon.svelte";
  import WinBox from "winbox/src/js/winbox.js";
  onMount(() => {
    console.log("test");
    let stack = WinBox.stack();
    stack.forEach((v, i, arr) => {
      v.close(true);
    });
    // new WinBox({
    //   title: "Hello",
    // });
  });
</script>

<Icon icon="/Flat-Remix-Blue-Dark/apps/scalable/gnome-terminal.svg" name="Terminal" width="64" height="64"/>

<!-- <div class="flex h-full"><CTerminal class="grow flex-1" /></div> -->
