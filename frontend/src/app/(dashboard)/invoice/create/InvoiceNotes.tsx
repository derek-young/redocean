import { Textarea } from "@/components/ui/textarea";

function InvoiceNotes() {
  return (
    <div className="bg-card rounded-lg shadow p-6 border border-border">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">Notes</h2>
      <Textarea placeholder="Additional notes or terms..." className="w-full" />
    </div>
  );
}

export default InvoiceNotes;
