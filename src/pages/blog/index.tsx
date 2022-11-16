import { NextPage } from "next";
import { useState } from "react";
import Header from "../components/Header";
import {trpc} from "../../utils/trpc";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

const Blog: NextPage = () => {
    const router = useRouter();
    const { data: sessionData } = useSession();

    const blogPostsArr: any = [];

    const { data: blogPostRes} = trpc.blog.getAllPostsByAuthorId.useQuery({authorId: sessionData ? sessionData?.user?.id : "default"});
    if(blogPostRes)
    {
        for(const blogPost of blogPostRes)
        {
            blogPostsArr.push(blogPost);
        }
    }

    const blogPanels = blogPostsArr.map((blogPost: {id: number, createdAt: Date, updatedAt: Date, authorId: string, title: string, content: string}) =>
        <BlogPanel 
            id={blogPost.id}
            title={blogPost.title}
            authorName={"You"}
        />
    )

    return(
        <div className="total-container">
            <Header />
            <div className="content-container">
                <div id="blog-panel-list">
                    {blogPanels}
                </div>
            </div>
        </div>
    );
}

export default Blog;

type BlogPanelProps = {
    id: number,
    title: string,
    authorName: string,
}


const BlogPanel: React.FC<BlogPanelProps> = (props: BlogPanelProps) => {
    const router = useRouter();

    function redirectToSpecificBlogPost() {
        router.push(`/blog/blogpost?post=${props.id}`)
    }

    return(
        <div className="blog-panel-container" onClick={redirectToSpecificBlogPost}>
            <h1>{`"${props.title}"`}</h1>
            <br></br>
            <h3>{`Written by: ${props.authorName}`}</h3>
        </div>
    );
}

