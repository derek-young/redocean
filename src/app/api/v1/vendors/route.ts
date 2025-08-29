import { Address, Contact, Vendor } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest
): Promise<
  NextResponse<(Vendor & { addresses: Address[]; contacts: Contact[] })[]>
> {
  const vendors = await prisma.vendor.findMany({
    include: {
      addresses: true,
      contacts: true,
    },
  });

  return NextResponse.json(vendors);
}
