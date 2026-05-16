<script lang="ts">
  let output = $state("shell for ctOS");
  let prompt = $state("Sh>");
  let pre: HTMLPreElement;
  let inputEl: HTMLInputElement;
  let wasAtBottom = false;

  function escape(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  let cmds: Record<string, (args: string[]) => string> = {
    help: (args: string[]) => {
      return 'wrtie &lt;script&gt; alert("Inject sql SELECT USERS PASSWORD or something idk im not a hacker")&lt;/script&gt;';
    },
    lolcat: (args: string[]) => {
      return `<span style="background: linear-gradient(to right, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${args.slice(1).join(" ")}</span>`;
    },
  };

  function isScrolledToBottom(el: HTMLElement): boolean {
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 2;
  }

  function handleCommands(input: string): string {
    let args = input.split(" ");
    if (input.length === 0) return "";
    if (cmds[args[0]] != null) return cmds[args[0]](args);
    return "Unknown command";
  }

  function onkeydown(ev: KeyboardEvent) {
    if (ev.key == "Enter") {
      output += `\n<span class="text-base-content/50">${prompt}${escape(inputEl.value)}</span>\n${handleCommands(inputEl.value)}`;
      inputEl.value = "";
    }
  }

  $effect.pre(() => {
    output; // track dependency
    if (pre) wasAtBottom = isScrolledToBottom(pre);
  });

  $effect(() => {
    output;
    if (wasAtBottom) pre.scrollTop = pre.scrollHeight;
  });
</script>

<div class="flex h-full w-full flex-col bg-[#474747] p-1 text-green-400">
  <pre
    bind:this={pre}
    class="min-h-0 grow overflow-y-auto text-wrap">{@html output}</pre>
  <label
    class="flex h-(--size) w-full shrink-0 items-center gap-2 border-t-2 border-t-black font-mono">
    <span class="text-base-content/50 select-none">{prompt}</span>
    <input
      bind:this={inputEl}
      type="text"
      class="grow bg-none outline-none"
      placeholder=""
      {onkeydown} />
  </label>
</div>
