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
    }),
    updateBlogPostTitleAndContent: publicProcedure
    .input(z.object({id: z.number(), title: z.string().nullish(), content: z.string().nullish()}))
    .mutation(({ctx, input}) => {
        return ctx.prisma.blogPost.update({
            where: {
                id: input.id
            },
            data: {
                title: input.title ? input.title : "",
                content: input.content ? input.content : ""
            }
        })
    })
});