import { z } from "zod";

const schema = z.object({
  ANTHROPIC_API_KEY: z.string().optional(),
  PORT: z.coerce.number().default(4000),
  WORKTREE_PATH: z.string().default("../klavem-draft"),
  DRAFT_BRANCH: z.string().default("draft"),
  MAIN_BRANCH: z.string().default("main"),
  PREVIEW_PORT: z.coerce.number().default(3001),
  PREVIEW_HOST: z.string().default("0.0.0.0"),
  GEMINI_API_KEY: z.string().optional(),
  PHOTOROOM_API_KEY: z.string().optional(),
  EDITOR_PASSWORD: z.string().min(4),
  DEMO_MODE: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1"),
});

export const env = schema.parse(process.env);
export type Env = z.infer<typeof schema>;
