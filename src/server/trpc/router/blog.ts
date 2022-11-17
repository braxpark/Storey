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
    .input(z.object({id: z.number(), title: z.string().nullish(), content: z.string().nullish(), public: z.boolean()}))
    .mutation(({ctx, input}) => {
        return ctx.prisma.blogPost.update({
            where: {
                id: input.id
            },
            data: {
                title: input.title ? input.title : "",
                content: input.content ? input.content : "",
                public: input.public,
            }
        })
    }),
    createBlogPost: publicProcedure
    .input(z.object({id: z.number(), authorId: z.string(), title: z.string(), content: z.string(), public: z.boolean(), createdAt: z.date()}))
    .mutation(({ctx, input}) => {
        return ctx.prisma.blogPost.create({
            data: {
                id: input.id,
                authorId: input.authorId,
                title: input.title,
                content: input.content,
                public: input.public,
                createdAt: input.createdAt,
                updatedAt: input.createdAt,
            }
        })   
    }),
    deleteBlogPostById: publicProcedure
    .input(z.object({id: z.number()}))
    .mutation(({ctx, input}) => {
        return ctx.prisma.blogPost.delete({
            where: {
                id: input.id
            }
        })
    }),
    getIfBlogIdExists: publicProcedure
    .input(z.object({id: z.number()}))
    .query(({ctx, input}) => {
        return ctx.prisma.blogPost.findUnique({
            where: {
                id: input.id
            }
        })
    })
});