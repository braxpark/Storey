import {NextPage} from "next";
import {useRouter} from "next/router";
import Header from "../../components/Header";
import {trpc} from "../../../utils/trpc";
const EditBlogPost: NextPage = () => {
    const router = useRouter();
    const blogId = Number(router.query.post);
    const {data : blogPost} = trpc.blog.getBlogPostById.useQuery({id: blogId});
    const user = trpc.user.getUserNameById.useQuery({id: String(blogPost?.authorId)});
    function redirectToBlogPost() {
        router.push(`/blog/blogpost?post=${blogId}`);
    }
    return(
        <div className="total-container">
            <Header />
            <div className="content-container" id="blog-post-full-outer">
                <div id="blog-post-full-options">
                    <button id="gen-btn" onClick={redirectToBlogPost}>Back</button>
                </div>
                <div id="blog-post-full-container">
                    <div contentEditable={true} id="blog-post-title" className="blog-post-full-editable">
                        {blogPost ? blogPost.title : ""}
                    </div>
                    <div>
                        {`Written By: ${user.data?.name}`}
                    </div>
                    <br></br>
                    <div contentEditable={true} id="blog-post-full-content" className="blog-post-full-editable">
                        {blogPost ? blogPost.content : ""}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBlogPost;