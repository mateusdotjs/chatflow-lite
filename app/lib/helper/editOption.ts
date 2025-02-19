import type { Option } from "~/types/nodeTypes";

export default function editOption(
  options: Option[],
  id: string,
  newText: string,
): Option[] {
  return options.map((option) => {
    return option.id === id ? { ...option, text: newText } : option;
  });
}
