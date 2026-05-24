<script lang="ts">
  import { onMount, mount, type Component } from "svelte";
  import Terminal from "./apps/TerminalPTY.svelte";
  import IRC from "./apps/IRC.svelte";
  import Icon from "./templates/Icon.svelte";
  import WinBox, { type WinBoxParams } from "winbox/src/js/winbox.js";

  onMount(() => {
    console.log("Piker Alpha");
    const stack = WinBox.stack();
    stack.forEach((v) => {
      v.close(true);
    });
  });

  function openWindow(
    component: Component,
    title: string,
    params?: WinBoxParams,
  ) {
    const container = document.createElement("div");
    container.style = "height:100%;width:100%;";

    // Mount Svelte component into it
    //const instance =
    mount(component, {
      target: container,
      props: {},
    });

    // Pass the container to WinBox via `mount`
    new WinBox(title, { ...params, mount: container });
  }
</script>

<!-- <div></div> -->
<div class="">
  <Icon
    icon="/icons/terminal.svg"
    name="Terminal"
    width="64"
    height="64"
    ondblclick={() => {
      openWindow(Terminal, "Terminal", {
        width: 9 * 80, // 80 cols (one letter can occupy 9px at most)
        height: 300,
        icon: `${import.meta.env.BASE_URL}/icons/terminal.svg`,
      });
    }} />

  <Icon
    icon="/icons/xchat.svg"
    name="Blastphemy"
    width="64"
    height="64"
    ondblclick={() => {
      openWindow(IRC, "Blastphemy IRC Client", {
        width: 9 * 80, // 80 cols (one letter can occupy 9px at most)
        height: 300,
        icon: `${import.meta.env.BASE_URL}/icons/xchat.svg`,
      });
    }} />
</div>
