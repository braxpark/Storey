import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect} from "react";
import Header from "../../components/Header";
import {trpc} from "../../../utils/trpc";
const EditBlogPost: NextPage = () => {
    const router = useRouter();
    const blogId = Number(router.query.post);
    const {data : blogPost} = trpc.blog.getBlogPostById.useQuery({id: blogId});
    const user = trpc.user.getUserNameById.useQuery({id: String(blogPost?.authorId)});
    const mutation = trpc.blog.updateBlogPostTitleAndContent.useMutation();

    function redirectToBlogPost() {
        console.log("redirect");
        router.push(`/blog/blogpost?post=${blogId}`);
    }

    const saveAndRedirect  = async () => {
        const newTitle = document.getElementById("blog-post-title")?.innerText;
        const newContent = document.getElementById("blog-post-full-content")?.innerText;
        await mutation.mutateAsync({id: blogId, title: newTitle, content: newContent});
        redirectToBlogPost();
    }

    useEffect(() => {
        document.getElementById("blog-post-full-content")!.innerText = blogPost ? blogPost.content : "";
        document.getElementById("blog-post-title")!.innerText = blogPost ? blogPost.title : "";
    })


    return(
        <div className="total-container">
            <Header />
            <div className="content-container" id="blog-post-full-outer">
                <div id="blog-post-full-options">
                    <button id="gen-btn" onClick={redirectToBlogPost}>Back</button>
                    <button id="gen-btn" onClick={saveAndRedirect}>Save</button>
                </div>
                <div id="blog-post-full-container">
                    <div contentEditable={true} id="blog-post-title" className="blog-post-full-editable">
                    </div>
                    <div>
                        {`Written By: ${user.data?.name}`}
                    </div>
                    <br></br>
                    <div contentEditable={true} id="blog-post-full-content" className="blog-post-full-editable">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBlogPost;