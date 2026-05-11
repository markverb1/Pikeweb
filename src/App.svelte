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

<div></div>
<Icon
  icon="/icons/terminal.svg"
  name="Terminal"
  width="64"
  height="64"
  ondblclick={(e) => {
    alert("Double click");
  }} />

<!-- <div class="flex h-full"><CTerminal class="grow flex-1" /></div> -->
