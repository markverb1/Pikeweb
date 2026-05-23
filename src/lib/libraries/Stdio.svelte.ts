import type { Syscalls } from "../classes/Kernel.svelte";

export function createStdio(sys: Syscalls) {
  return {
    print(str: string, error: boolean = false, object: object = {}) {
      sys.stdout({
        text: str,
        isError: error,
        obj: object,
      });
    },
    println(str: string, error: boolean = false, object: object = {}) {
      sys.stdout({
        text: str + "\n",
        isError: error,
        obj: object,
      });
    },
  };
}
