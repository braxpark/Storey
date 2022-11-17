import { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import BlogPanel from "../components/BlogPanel";
import {trpc} from "../../utils/trpc";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

const Blog: NextPage = () => {
    const router = useRouter();
    const { data: sessionData } = useSession();

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
        }
    }

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
