import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import AddLineItemDropdown, { LineItemType } from "./AddLineItemDropdown";

export interface InvoiceLine {
  id: string;
  type: LineItemType;
  item: string;
  description: string;
  quantity: number;
  unitAmount: number;
  lineAmount: number;
  taxRateId?: string;
}

const usdCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function InvoiceLine({
  line,
  updateLine,
}: {
  line: InvoiceLine;
  updateLine: (
    id: string,
    field: keyof InvoiceLine,
    value: string | number
  ) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: line.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-8">
        <button
          name="drag-handle"
          className="cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell>
        <Input
          name="invoice-line-item"
          onChange={(e) => updateLine(line.id, "item", e.target.value)}
          placeholder="Enter item or service"
          value={line.item}
        />
      </TableCell>
      <TableCell>
        <Input
          name="invoice-line-description"
          onChange={(e) => updateLine(line.id, "description", e.target.value)}
          placeholder="Enter description"
          value={line.description}
        />
      </TableCell>
      <TableCell>
        <Input
          className="no-spinner"
          name="invoice-line-quantity"
          onChange={(e) =>
            updateLine(
              line.id,
              "quantity",
              e.target.value === "" ? 0 : parseFloat(e.target.value) || 0
            )
          }
          placeholder="0"
          type="number"
          value={line.quantity || ""}
        />
      </TableCell>
      <TableCell>
        <Input
          className="no-spinner"
          name="invoice-line-unit-amount"
          onChange={(e) =>
            updateLine(
              line.id,
              "unitAmount",
              e.target.value === "" ? 0 : parseFloat(e.target.value) || 0
            )
          }
          placeholder="0.00"
          type="number"
          value={line.unitAmount || ""}
        />
      </TableCell>
      <TableCell className="text-right font-medium">
        {usdCurrencyFormatter.format(line.quantity * line.unitAmount)}
      </TableCell>
    </TableRow>
  );
}

function InvoiceLineItems({
  lines,
  setLines,
}: {
  lines: InvoiceLine[];
  setLines: (lines: InvoiceLine[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addLine = (type: LineItemType) => {
    console.log("Adding line of type", type);
  };

  const updateLine = (
    id: string,
    field: keyof InvoiceLine,
    value: string | number
  ) => {
    setLines(
      lines.map((line) => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value };

          return updatedLine;
        }
        return line;
      })
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = lines.findIndex((line) => line.id === active.id);
      const newIndex = lines.findIndex((line) => line.id === over.id);

      setLines(arrayMove(lines, oldIndex, newIndex));
    }
  };

  // TODO: Add text line
  // add subtotal line

  return (
    <div className="bg-card rounded-lg shadow p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-card-foreground">
          Invoice Line Items
        </h2>
        <AddLineItemDropdown onAddLine={addLine} />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={lines.map((line) => line.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Item or Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Quantity</TableHead>
                <TableHead className="w-32">Unit Amount</TableHead>
                <TableHead className="w-32 text-right">Line Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line) => (
                <InvoiceLine
                  key={line.id}
                  line={line}
                  updateLine={updateLine}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default InvoiceLineItems;
