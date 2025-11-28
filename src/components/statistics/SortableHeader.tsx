import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
} | null;

interface SortableHeaderProps<T> {
  children: React.ReactNode;
  sortKey: string;
  currentSort: SortConfig<T>;
  onSort: () => void;
  align?: "left" | "right";
}

export default function SortableHeader<T>({
  children,
  sortKey,
  currentSort,
  onSort,
  align = "left",
}: SortableHeaderProps<T>) {
  const isActive = currentSort?.key === sortKey;
  const direction = currentSort?.direction;

  return (
    <th
      className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors select-none ${
        align === "right" ? "text-right" : ""
      }`}
      onClick={onSort}
    >
      <div
        className={`flex items-center gap-1 ${
          align === "right" ? "justify-end" : ""
        }`}
      >
        {children}
        {isActive ? (
          direction === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" />
        )}
      </div>
    </th>
  );
}

export type { SortConfig };
