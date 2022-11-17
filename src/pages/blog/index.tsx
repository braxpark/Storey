import { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import {trpc} from "../../utils/trpc";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

const Blog: NextPage = () => {
    const router = useRouter();
    const { data: sessionData } = useSession();

    const blogPostsArr: any = [];
    const blogPanelsArr: any = [];

    const { data: blogPostRes} = trpc.blog.getAllPostsByAuthorId.useQuery({authorId: sessionData ? sessionData?.user?.id : "default"});
    const user = trpc.user.getUserNameById.useQuery({id: sessionData ? sessionData.user?.id : ""})
    const userName = String(user ? user.data?.name : "Anonymous");
    if(blogPostRes)
    {
        for(const blogPost of blogPostRes)
        {
            const blogPanel = (<BlogPanel id={blogPost.id} title={blogPost.title} authorName={userName}/>)
            blogPanelsArr.push(blogPanel);
            blogPostsArr.push(blogPost);
        }
    }

    const blogPanels = blogPostsArr.map((blogPost: {id: number, createdAt: Date, updatedAt: Date, authorId: string, title: string, content: string}) =>
        <BlogPanel 
            id={blogPost.id}
            title={blogPost.title}
            authorName={user.data ? user.data.name : ""}
            key={blogPost.id}
        />
    )

    function createPost() {
        router.push("/blog/createpost/");
    }

    return(
        <div className="total-container">
            <Header />
            <div className="content-container">
                <div id="blog-panels-options">
                    <button id="gen-btn" className="text-xs" onClick={createPost}>
                        Create a Post
                    </button>
                </div>
                <div id="blog-panel-list">
                    {blogPanelsArr}
                </div>
            </div>
        </div>
    );
}

export default Blog;

type BlogPanelProps = {
    id: number,
    title: string,
    authorName: string | null,
}

const BlogPanel: React.FC<BlogPanelProps> = (props: BlogPanelProps) => {
    const router = useRouter();

    function redirectToSpecificBlogPost() {
        router.push(`/blog/blogpost?post=${props.id}`)
    }

    return(
        <div className="blog-panel-container" onClick={redirectToSpecificBlogPost}>
            <h1 id="blog-panel-title">{props.title}</h1>
            <br></br>
            <h3>{`Written by: ${props.authorName}`}</h3>
        </div>
    );
}

