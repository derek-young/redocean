import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type LineItemType = "item" | "text" | "subtotal";

interface AddLineItemDropdownProps {
  onAddLine: (type: LineItemType) => void;
}

export default function AddLineItemDropdown({
  onAddLine,
}: AddLineItemDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="default" size="default">
          + Add Line Item
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-2">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onAddLine("item")}
          >
            Add item or service
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onAddLine("text")}
          >
            Add text row
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onAddLine("subtotal")}
          >
            Add subtotal
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
