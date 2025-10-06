import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LineItemType } from "./types";

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
      <PopoverContent align="end" className="w-fit flex flex-col">
        <Button
          type="button"
          variant="ghost"
          className="justify-start"
          onClick={() => onAddLine("item")}
        >
          Add item or service
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="justify-start"
          onClick={() => onAddLine("text")}
        >
          Add text row
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="justify-start"
          onClick={() => onAddLine("subtotal")}
        >
          Add subtotal
        </Button>
      </PopoverContent>
    </Popover>
  );
}
