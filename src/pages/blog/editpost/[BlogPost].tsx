import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Header from "../../components/Header";
import {trpc} from "../../../utils/trpc";
const EditBlogPost: NextPage = () => {

    const handleChecked = () => {
        setChecked(!checked);
    }

    const router = useRouter();
    const blogId = Number(router.query.post);
    const {data : blogPost} = trpc.blog.getBlogPostById.useQuery({id: blogId});
    const user = trpc.user.getUserNameById.useQuery({id: String(blogPost?.authorId)});
    const mutation = trpc.blog.updateBlogPostTitleAndContent.useMutation();
    const deletionMutation = trpc.blog.deleteBlogPostById.useMutation();
    const [checked, setChecked] = useState(Boolean(blogPost ? blogPost.public : false));
    function redirectToBlogPost() {
        router.push(`/blog/blogpost?post=${blogId}`);
    }

    const saveAndRedirect  = async () => {
        const newTitle = document.getElementById("blog-post-title")?.innerText;
        const newContent = document.getElementById("blog-post-full-content")?.innerText;
        await mutation.mutateAsync({id: blogId, title: newTitle, content: newContent, public: checked});
        redirectToBlogPost();
    }

    const removeBlur = () => {
        document.getElementById("edit-post-total")!.style.filter = 'blur(0px)';
    }

    const addBlur = () => {
        document.getElementById("edit-post-total")!.style.filter = 'blur(1px)';
    }

    const handleDelete = () => {
        addBlur();
        document.getElementById("blur-container")!.style.visibility = 'visible';
    }

    const deletePostAndRedirect = async () => {
        await deletionMutation.mutateAsync({id: blogId});
        router.push("/blog");
    }

    const confirmationCancel = () => {
        document.getElementById("blur-container")!.style.visibility = 'hidden';
        removeBlur();
    }

    useEffect(() => {
        document.getElementById("blog-post-full-content")!.innerText = blogPost ? blogPost.content : "";
        document.getElementById("blog-post-title")!.innerText = blogPost ? blogPost.title : "";
        const ele = document.getElementById("public-box") as HTMLInputElement;
        ele.checked = checked;
    })


    return(
        <div className={"absolute"}>
            <div className="total-container" id="edit-post-total">
                <Header />
                <div className="content-container" id="blog-post-full-outer">
                    <div id="blog-post-full-options">
                        <button id="gen-btn" onClick={redirectToBlogPost}>Back</button>
                        <button id="gen-btn" onClick={saveAndRedirect}>Save</button>
                        <button id="gen-btn" onClick={handleDelete}>Delete</button>
                        <div className="flex flex-col text-center" id="gen-panel">  
                            <h1>Publish</h1>
                            <input id="public-box" type={"checkbox"} onChange={handleChecked}></input>
                        </div>
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
            <div id="blur-container">
                <div id="blur-window-centered">
                    <button onClick={deletePostAndRedirect}>Confirm Delete</button>
                    <button onClick={confirmationCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default EditBlogPost;