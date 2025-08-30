import { Address, Contact, Customer, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest
): Promise<
  NextResponse<(Customer & { addresses: Address[]; contacts: Contact[] })[]>
> {
  const customers = await prisma.customer.findMany({
    include: {
      addresses: true,
      contacts: true,
    },
  });

  return NextResponse.json(customers);
}
