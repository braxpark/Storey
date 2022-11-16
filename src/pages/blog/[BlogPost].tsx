import {NextPage} from "next";
import {useRouter} from "next/router";
import { useEffect } from "react";
import {trpc} from "../../utils/trpc";
import Header from "../components/Header";

const BlogPost: NextPage = () => {
    const router = useRouter();
    const blogId = Number(router.query.post);
    const { data: fullBlogPost } = trpc.blog.getBlogPostById.useQuery({id: blogId});
    const user = trpc.user.getUserNameById.useQuery({id: fullBlogPost ? fullBlogPost.authorId : ""})

    const blogPostContent = fullBlogPost ? fullBlogPost.content : "";

    function redirectBackToMainBlog() {
        router.push("/blog");
    }

    function redirectToEditBlogPost() {
        router.push(`/blog/editpost/blogpost?post=${blogId}`);
    }

    useEffect(() => {
        document.getElementById("blog-post-full-content")!.innerHTML = blogPostContent;
    });
    return(
       <div className="total-container">
            <Header />
            <div className="content-container" id="blog-post-full-outer">
                <div id="blog-post-full-options">
                    <button id="gen-btn" onClick={redirectBackToMainBlog}>Back</button>
                    <button id="gen-btn" onClick={redirectToEditBlogPost}>Edit</button>
                </div>
                <div id="blog-post-full-container">
                    <h1>
                        {`"${fullBlogPost ? fullBlogPost.title : ""}"`}
                    </h1>

                    <h2>{`Written By: ${user.data?.name}`}</h2>

                    <p id="blog-post-full-content" />

                </div>
            </div>
        </div>
    );
}

export default BlogPost;