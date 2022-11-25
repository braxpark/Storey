import {NextPage} from "next";
import {useRouter} from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {trpc} from "../../../../utils/trpc";
import Header from "../../../components/Header";

const Post: NextPage = () => {
    const router = useRouter();
    const blogId = Number(router.query.id);
    const { data: sessionData} = useSession();
    const { data: fullBlogPost } = trpc.blog.getBlogPostById.useQuery({id: blogId});
    const user = trpc.user.getUserNameById.useQuery({id: fullBlogPost ? fullBlogPost.authorId : ""})
    const numberOfDigits = String(router.query.id).length;
    const newUrl = router.asPath.slice(0, router.asPath.length - numberOfDigits - 9);

    function checkIfGoodPage()
    {
        if(!fullBlogPost)
        {
            // "That page doesnt exist!";
            router.push("/oops/dne"); // eventually redirect to error page
        }
    }
    const blogPostContent = fullBlogPost ? fullBlogPost.content : "";
    const blogPostTitle = fullBlogPost ? fullBlogPost.title : "";

    const authorized = () => {
        if(!fullBlogPost)
            return false;
        else{
            if(sessionData?.user?.id === fullBlogPost.authorId)
                return true;
            else
                return false;
        }
    }

    function redirectBackToMainBlog() {
        router.back();
    }

    function redirectToEditBlogPost() {
        const editUrl = newUrl + `/editpost/post?id=${blogId}`;
        router.push(editUrl);
    }

    useEffect(() => {
        document.getElementById("blog-post-full-title")!.innerHTML = blogPostTitle;
        document.getElementById("blog-post-full-content")!.innerHTML = blogPostContent;
    });
    return(
       <div className="total-container">
            <Header />
            <div className="content-container" id="blog-post-full-outer">
                <div id="blog-post-full-options">
                    <button id="gen-btn" onClick={redirectBackToMainBlog}>Back</button>
                    { authorized() && (<button id="gen-btn" onClick={redirectToEditBlogPost}>Edit</button>)}
                </div>
                <div id="blog-post-full-container">
                    <h1 id="blog-post-full-title"/>

                    <h2>{`Written By: ${user.data?.name}`}</h2>

                    <p id="blog-post-full-content" />

                </div>
            </div>
        </div>
    );
}

export default Post;