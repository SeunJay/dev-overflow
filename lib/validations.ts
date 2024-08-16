import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Question must contain at least 5 characters",
    })
    .max(130),
  explanation: z.string().min(10, {
    message: "Explanation must contain at least 100 characters",
  }),

  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});
