import CreateInvoiceProviders from "./context/CreateInvoiceProviders";
import CreateInvoice from "./CreateInvoice";

function CreateInvoicePage() {
  return (
    <CreateInvoiceProviders>
      <CreateInvoice />
    </CreateInvoiceProviders>
  );
}

export default CreateInvoicePage;
