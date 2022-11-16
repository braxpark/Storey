import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const blogRouter = router({
    getAllPostsByAuthorId: publicProcedure
    .input(z.object({ authorId: z.string().nullish()}))
    .query(({ctx, input}) => {
        return ctx.prisma.blogPost.findMany({
            where: {
                authorId: input.authorId ? input.authorId : "default"
            }
        })
    }),
    getBlogPostById: publicProcedure
    .input(z.object({id: z.number()}))
    .query(({ctx, input}) => {
        return ctx.prisma.blogPost.findFirst({
            where: {
                id: input.id
            }
        })
    })
});