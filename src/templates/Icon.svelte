<script lang="ts">
  import { onMount } from "svelte";

  type Props = {
    icon: string;
    name: string;
    width?: string;
    height?: string;
    ondblclick?: (e: MouseEvent) => void;
    startingX?: number;
    startingY?: number;
  };

  const {
    icon,
    name,
    width = "32",
    height = "32",
    ondblclick,
    startingX = 0,
    startingY = 0,
  }: Props = $props();

  const longDragReq = 3;

  let prevScreenX = $state(window.innerWidth);
  let prevScreenY = $state(window.innerHeight);
  let x = $state(0);
  let y = $state(0);
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  let longDragTimes = 0;

  onMount(() => {
    x = startingX;
    y = startingY;
  });

  function onMouseDown() {
    dragging = true;
    longDragTimes = 0;
  }

  function onMouseMove(event: PointerEvent) {
    if (!dragging) return;
    if (longDragTimes <= longDragReq) {
      longDragTimes++;
      if (longDragTimes <= longDragReq) {
        offsetX = event.clientX - x;
        offsetY = event.clientY - y;
      }
      return;
    }
    x = event.clientX - offsetX;
    y = event.clientY - offsetY;
  }

  function onMouseUp() {
    dragging = false;
  }

  function onresize() {
    x = (x / prevScreenX) * window.innerWidth;
    y = (y / prevScreenY) * window.innerHeight;
    prevScreenX = window.innerWidth;
    prevScreenY = window.innerHeight;
    console.log(x, y);
  }
</script>

<button
  class="flex flex-col items-center rounded-md p-1.5 hover:bg-gray-100/30 focus:bg-gray-100/50"
  style="transform: translate({x}px, {y}px);"
  onpointerdown={onMouseDown}
  {ondblclick}>
  <img
    src={import.meta.env.BASE_URL + icon.replace(/^\/+/, "")}
    alt={name}
    {width}
    {height}
    draggable="false" />
  <span
    class="text-neutral-50 drop-shadow-[0_0_1.2px_rgba(0,0,0,1),0_0_1.2px_rgba(0,0,0,1)]">
    {name}
  </span>
</button>

<svelte:window onpointermove={onMouseMove} onpointerup={onMouseUp} {onresize} />
<!--[-webkit-text-stroke:0.1px_#595959] -->
