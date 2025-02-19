import type { Option } from "~/types/nodeTypes";

export default function removeOption(options: Option[], id: string): Option[] {
  if (options.length === 1) return options;
  return options.filter((option) => option.id !== id);
}
