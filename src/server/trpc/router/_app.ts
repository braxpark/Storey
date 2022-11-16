import { router } from "../trpc";
import { authRouter } from "./auth";
import { blogRouter } from "./blog";
import { exampleRouter } from "./example";
import { userRouter } from "./user";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  blog: blogRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
