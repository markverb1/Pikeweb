<script lang="ts">
  import TerminalCursor from "../lib/TerminalCursor.svelte";

  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  let lines = $state([""]);
  let cursorCol = $state(0);
  let cursorRow = $state(0);
  let focused = $state(false);
  // svelte-ignore non_reactive_update
  let cursor: TerminalCursor;

  export function onWinFocus() {
    focused = true;
  }
  export function onWinBlur() {
    focused = false;
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function moveCursorUp() {
    if (cursorRow > 0) {
      cursorRow--;
      cursorCol = clamp(cursorCol, 0, lines[cursorRow].length);
    }
  }
  function moveCursorRight() {
    if (cursorCol < lines[cursorRow].length) {
      cursorCol++;
    } else if (cursorRow < lines.length - 1) {
      cursorRow++;
      cursorCol = 0;
    }
  }
  function moveCursorDown() {
    if (cursorRow < lines.length - 1) {
      cursorRow++;
      cursorCol = clamp(cursorCol, 0, lines[cursorRow].length);
    }
  }
  function moveCursorLeft() {
    if (cursorCol > 0) {
      cursorCol--;
    } else if (cursorRow > 0) {
      cursorRow--;
      cursorCol = lines[cursorRow].length;
    }
  }

  // document.addEventListener("keydown", async (ev) => {
  //   if (!focused) return;
  //   //ev.preventDefault();
  //   const key = ev.key;
  //   cursor?.stopAnimation();
  //   sleep(1000).then(() => cursor?.startAnimation());

  //   switch (key) {
  //     case "ArrowLeft":
  //       moveCursorLeft();
  //       break;
  //     case "ArrowRight":
  //       moveCursorRight();
  //       break;
  //     case "ArrowUp":
  //       moveCursorUp();
  //       break;
  //     case "ArrowDown":
  //       moveCursorDown();
  //       break;
  //     case "Enter": {
  //       const before = lines[cursorRow].slice(0, cursorCol);
  //       const after = lines[cursorRow].slice(cursorCol);
  //       lines = [
  //         ...lines.slice(0, cursorRow),
  //         before,
  //         after,
  //         ...lines.slice(cursorRow + 1),
  //       ];
  //       cursorRow++;
  //       cursorCol = 0;
  //       break;
  //     }

  //     case "Backspace":
  //       if (cursorCol > 0) {
  //         lines[cursorRow] =
  //           lines[cursorRow].slice(0, cursorCol - 1) +
  //           lines[cursorRow].slice(cursorCol);
  //         cursorCol--;
  //       } else if (cursorRow > 0) {
  //         const prevLen = lines[cursorRow - 1].length;
  //         lines = [
  //           ...lines.slice(0, cursorRow - 1),
  //           lines[cursorRow - 1] + lines[cursorRow],
  //           ...lines.slice(cursorRow + 1),
  //         ];
  //         cursorRow--;
  //         cursorCol = prevLen;
  //       }
  //       break;

  //     case "Delete":
  //       if (cursorCol < lines[cursorRow].length) {
  //         lines[cursorRow] =
  //           lines[cursorRow].slice(0, cursorCol) +
  //           lines[cursorRow].slice(cursorCol + 1);
  //       } else if (cursorRow < lines.length - 1) {
  //         lines = [
  //           ...lines.slice(0, cursorRow),
  //           lines[cursorRow] + lines[cursorRow + 1],
  //           ...lines.slice(cursorRow + 2),
  //         ];
  //       }
  //       break;

  //     default:
  //       if (key.length !== 1) break;
  //       lines[cursorRow] =
  //         lines[cursorRow].slice(0, cursorCol) +
  //         key +
  //         lines[cursorRow].slice(cursorCol);
  //       cursorCol++;
  //   }
  // });
</script>

<div
  class="bg-term-background h-full w-full font-mono break-all whitespace-pre-wrap {focused
    ? 'text-term-foreground'
    : 'text-term-foreground-faded'}">
  <span>
    {#each lines as line, i}
      {#if i === cursorRow}
        {line.slice(0, cursorCol)}<TerminalCursor
          bind:this={cursor}
          offset={0} />{line.slice(cursorCol)}
      {:else}
        {line}
      {/if}
      {#if i < lines.length - 1}{"\n"}{/if}
    {/each}
  </span>
</div>
