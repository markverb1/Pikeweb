// Programs.ts
import Program from "./base/Program.svelte";

const modules = import.meta.glob("./programs/*.ts", { eager: true });
export const Programs: Record<string, Program> = {};

for (const module of Object.values(modules)) {
  const program = (module as { default: Program }).default;
  Programs[program.name] = program;
}
