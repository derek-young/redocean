import { prismaReadOnly } from "@/db";

import { ToolResult } from "./types";

export async function findEntityByName({
  query,
}: {
  query: string;
}): Promise<ToolResult> {
  const customers = await prismaReadOnly.customer.findMany({
    where: { name: { contains: query, mode: "insensitive" } },
    take: 3,
    select: { id: true, name: true },
  });

  const vendors = await prismaReadOnly.vendor.findMany({
    where: { name: { contains: query, mode: "insensitive" } },
    take: 3,
    select: { id: true, name: true },
  });

  console.log("customers found: ", customers);

  const results = [
    ...customers.map((c) => ({ type: "Customer", id: c.id, name: c.name })),
    ...vendors.map((v) => ({ type: "Vendor", id: v.id, name: v.name })),
  ];

  console.log("findEntityByName results: ", results);

  return {
    type: "text",
    text: JSON.stringify(results, null, 2),
  };
}
