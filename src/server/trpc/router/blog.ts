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
    .input(z.object({id: z.string()}))
    .query(({ctx, input}) => {
        return ctx.prisma.blogPost.findFirst({
            where: {
                id: input.id
            }
        })
    }),
    updateBlogPostTitleAndContent: publicProcedure
    .input(z.object({id: z.string(), title: z.string().nullish(), content: z.string().nullish(), public: z.boolean()}))
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
    .input(z.object({authorName: z.string(), authorId: z.string(), title: z.string(), content: z.string(), public: z.boolean(), createdAt: z.date()}))
    .mutation(({ctx, input}) => {
        return ctx.prisma.blogPost.create({
            data: {
                authorId: input.authorId,
                authorName: input.authorName,
                title: input.title,
                content: input.content,
                public: input.public,
                createdAt: input.createdAt,
                updatedAt: input.createdAt,
            }
        })   
    }),
    deleteBlogPostById: publicProcedure
    .input(z.object({id: z.string()}))
    .mutation(({ctx, input}) => {
        return ctx.prisma.blogPost.delete({
            where: {
                id: input.id
            }
        })
    }),
    getIfBlogIdExists: publicProcedure
    .input(z.object({id: z.string()}))
    .query(({ctx, input}) => {
        return ctx.prisma.blogPost.findUnique({
            where: {
                id: input.id
            }
        })
    }),
    getNumberOfPublishedPosts: publicProcedure
    .query(({ctx}) => {
        return ctx.prisma.blogPost.count({
            where: {
                public: true
            }
        })
    }),
    getIfPostExists: publicProcedure
    .input(z.object({blogId: z.string()}))
    .query(({ctx, input}) => {
        return ctx.prisma.blogPost.count({
            where: {
                public: true,
                id: input.blogId,
            }
        })
    }),
    getRangeOfPublishedPostsWithOffsetAndStride: publicProcedure
    .input(z.object({offset: z.number(), stride: z.number()}))
    .query(({ctx, input}) => {
        return ctx.prisma.blogPost.findMany({
            skip: input.offset,
            take: input.stride,
            where: { public: true },
        })
    }),
    getPublishedPostsWithOffsetAndStrideByDateDesc: publicProcedure
    .input(z.object({offset: z.number(), stride: z.number()}))
    .query(({ctx, input}) => {
        return ctx.prisma.blogPost.findMany({
            skip: input.offset,
            take: input.stride,
            where: {public: true},
            orderBy: {
                createdAt: "desc"
            }
        })
    }),
    getPublishedPostsWithOffsetAndStrideByDateAsc: publicProcedure
    .input(z.object({offset: z.number(), stride: z.number()}))
    .query(({ctx, input}) => {
        return ctx.prisma.blogPost.findMany({
            skip: input.offset,
            take: input.stride,
            where: {public: true},
            orderBy: {
                createdAt: "asc"
            }
        })
    }),
    getPublishedPostsWithOffsetAndStrideByAuthor: publicProcedure
    .input(z.object({offset: z.number(), stride: z.number(), authorId: z.string()}))
    .query(({ctx, input}) => {
        return ctx.prisma.blogPost.findMany({
            skip: input.offset,
            take: input.stride,
            where: {
                public: true,
                authorId: input.authorId,
            },
        })
    }),
});