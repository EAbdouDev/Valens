import { DeepPartial } from "ai";
import { z } from "zod";

export const dateSchema = z.object({
  date: z.string().describe("the current Time and date"),
  resp: z.string().describe("Is this time good to study?"),
});

export type dateSchema = DeepPartial<typeof dateSchema>;
