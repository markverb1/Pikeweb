<script>
  import { onMount, mount } from "svelte";
  import Terminal from "./apps/Terminal.svelte";
  import Icon from "./templates/Icon.svelte";
  import WinBox from "winbox/src/js/winbox.js";
  onMount(() => {
    console.log("test");
    let stack = WinBox.stack();
    stack.forEach((v, i, arr) => {
      v.close(true);
    });
  });

  function openWindow() {
    const container = document.createElement("div");
    container.style = "height:100%;width:100%;";

    // Mount Svelte component into it
    const instance = mount(Terminal, {
      target: container,
      props: {},
    });

    // Pass the container to WinBox via `mount`
    new WinBox("Terminal", {
      mount: container,
      width: 9 * 80, // 80 cols (one letter can occupy 9px at most)
      height: 300,
      icon: `${import.meta.env.BASE_URL}/icons/terminal.svg`,
      // onfocus() {
      //   instance.onWinFocus();
      // },
      // onblur() {
      //   instance.onWinBlur();
      // },
    });
  }
</script>

<div></div>
<Icon
  icon="/icons/terminal.svg"
  name="Terminal"
  width="64"
  height="64"
  ondblclick={openWindow} />

<!-- <div class="flex h-full"><CTerminal class="grow flex-1" /></div> -->
