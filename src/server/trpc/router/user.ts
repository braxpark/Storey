import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const userRouter = router({
    getUserNameById: publicProcedure
    .input(z.object({id: z.string().nullish()}))
    .query(({ctx, input}) => {
        return ctx.prisma.user.findFirst({
            where: {
                id: input.id ? input.id : "Anonymous",
            }
        })
    })
});