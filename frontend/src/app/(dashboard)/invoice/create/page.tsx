import CreateInvoiceProvider from "./context/CreateInvoiceProvider";
import CreateInvoice from "./CreateInvoice";

function CreateInvoicePage() {
  return (
    <CreateInvoiceProvider>
      <CreateInvoice />
    </CreateInvoiceProvider>
  );
}

export default CreateInvoicePage;
