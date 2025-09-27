import CreateInvoice from "./CreateInvoice";
import { CreateInvoiceContextProvider } from "./CreateInvoiceContext";

function CreateInvoicePage() {
  return (
    <CreateInvoiceContextProvider>
      <CreateInvoice />
    </CreateInvoiceContextProvider>
  );
}

export default CreateInvoicePage;
