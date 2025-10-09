import { Request, Response } from "express";

import { getCurrentSequenceValue } from "@/utils/sequences";

export const getInvoiceSequenceValue = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    const sequenceResult = await getCurrentSequenceValue(
      "invoice_number",
      tenantId
    );

    res.status(200).json({
      nextNumber: sequenceResult.value,
      prefix: sequenceResult.prefix,
    });
  } catch (error) {
    console.error("Error getting next invoice sequence number:", error);
    res
      .status(500)
      .json({ error: "Failed to get next invoice sequence number" });
  }
};
