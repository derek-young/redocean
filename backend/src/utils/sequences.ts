import { Sequence, Tenant } from "@prisma/client";
import { prisma } from "@/db";

interface SequenceResult {
  value: string;
  numericValue: number;
  prefix?: string;
}

interface SequenceOptions {
  retries?: number;
  retryDelay?: number;
}

class SequenceNotFoundError extends Error {
  constructor(sequenceName: string, tenantId: string) {
    super(`Sequence '${sequenceName}' not found for tenant '${tenantId}'`);
    this.name = "SequenceNotFoundError";
  }
}

class SequenceExhaustedError extends Error {
  constructor(sequenceName: string) {
    super(`Sequence '${sequenceName}' has reached maximum value`);
    this.name = "SequenceExhaustedError";
  }
}

function formatResult(seq: Sequence): SequenceResult {
  return {
    value: seq.prefix
      ? `${seq.prefix}${seq.nextValue}`
      : seq.nextValue.toString(),
    numericValue: seq.nextValue,
    prefix: seq.prefix ?? undefined,
  };
}

/**
 * Gets the next value from a sequence
 * @param name - The sequence name
 * @param tenantId - The tenant ID
 * @param options - Optional configuration for retries
 * @returns Promise<SequenceResult> - The formatted sequence value with metadata
 */
export async function generateNextSequenceValue(
  name: string,
  tenantId: Tenant["id"],
  options: SequenceOptions = {}
): Promise<SequenceResult> {
  const { retries = 3, retryDelay = 100 } = options;

  if (!name || typeof name !== "string") {
    throw new Error("Sequence name must be a non-empty string");
  }
  if (!tenantId || typeof tenantId !== "string") {
    throw new Error("Tenant ID must be a non-empty string");
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Use a transaction to ensure atomicity
      const result = await prisma.$transaction(async (tx) => {
        const seq = await tx.sequence.findUnique({
          where: {
            tenantId_name: {
              tenantId,
              name,
            },
          },
        });

        if (!seq) {
          throw new SequenceNotFoundError(name, tenantId);
        }

        // Postgres Int is a 32-bit signed integer
        if (seq.nextValue >= 2147483647) {
          throw new SequenceExhaustedError(name);
        }

        const currentValue = seq.nextValue;

        await tx.sequence.update({
          where: { id: seq.id },
          data: { nextValue: currentValue + 1 },
        });

        return formatResult(seq);
      });

      return result;
    } catch (error) {
      lastError = error as Error;

      if (
        error instanceof SequenceNotFoundError ||
        error instanceof SequenceExhaustedError
      ) {
        throw error;
      }

      // Log the error for debugging
      console.warn(`Sequence generation attempt ${attempt + 1} failed:`, error);

      // If this was the last attempt, throw the error
      if (attempt === retries) {
        throw new Error(
          `Failed to generate sequence after ${retries + 1} attempts: ${
            lastError.message
          }`
        );
      }

      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, retryDelay * Math.pow(2, attempt))
      );
    }
  }

  throw lastError || new Error("Unexpected error in sequence generation");
}

/**
 * Gets multiple sequence values in a single transaction
 * @param requests - Array of sequence requests
 * @returns Promise<SequenceResult[]> - Array of sequence results
 */
export async function generateNextSequenceValues(
  requests: Array<{ name: string; tenantId: Tenant["id"] }>
): Promise<SequenceResult[]> {
  if (!requests.length) {
    return [];
  }

  return await prisma.$transaction(async (tx) => {
    const results: SequenceResult[] = [];

    for (const { name, tenantId } of requests) {
      const seq = await tx.sequence.findUnique({
        where: {
          tenantId_name: {
            tenantId,
            name,
          },
        },
      });

      if (!seq) {
        throw new SequenceNotFoundError(name, tenantId);
      }

      if (seq.nextValue >= 2147483647) {
        throw new SequenceExhaustedError(name);
      }

      const currentValue = seq.nextValue;

      await tx.sequence.update({
        where: { id: seq.id },
        data: { nextValue: currentValue + 1 },
      });

      results.push(formatResult(seq));
    }

    return results;
  });
}

/**
 * Creates a sequence if it doesn't exist
 * @param name - The sequence name
 * @param tenantId - The tenant ID
 * @param options - Optional configuration
 */
export async function createSequenceIfNotExists(
  name: string,
  tenantId: Tenant["id"],
  options: { prefix?: string; startValue?: number } = {}
): Promise<void> {
  const { prefix, startValue = 1 } = options;

  await prisma.sequence.upsert({
    where: {
      tenantId_name: {
        tenantId,
        name,
      },
    },
    update: {},
    create: {
      name,
      tenantId,
      prefix,
      nextValue: startValue,
    },
  });
}

/**
 * Gets the current value of a sequence without incrementing it
 * @param name - The sequence name
 * @param tenantId - The tenant ID
 * @returns Promise<SequenceResult> - The current sequence value
 */
export async function getCurrentSequenceValue(
  name: string,
  tenantId: Tenant["id"]
): Promise<SequenceResult> {
  const seq = await prisma.sequence.findUnique({
    where: {
      tenantId_name: {
        tenantId,
        name,
      },
    },
  });

  if (!seq) {
    throw new SequenceNotFoundError(name, tenantId);
  }

  return formatResult(seq);
}
