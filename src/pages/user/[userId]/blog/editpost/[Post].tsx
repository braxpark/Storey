import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import { useSession } from "next-auth/react";
import Header from "../../../../components/Header";
import {trpc} from "../../../../../utils/trpc";
const EditBlogPost: NextPage = () => {

    const router = useRouter();
    const blogId = Number(router.query.id);
    const {data : blogPost} = trpc.blog.getBlogPostById.useQuery({id: blogId});
    const initPublished = Boolean(blogPost?.public);
    const user = trpc.user.getUserNameById.useQuery({id: String(blogPost?.authorId)});
    const mutation = trpc.blog.updateBlogPostTitleAndContent.useMutation();
    const deletionMutation = trpc.blog.deleteBlogPostById.useMutation();
    const [checked, setChecked] = useState(Boolean(blogPost ? blogPost.public : false));
    const { data: sessionData } = useSession();
    const [auth, setAuth] = useState(false);

    const handleChecked = () => {
        setChecked(!checked);
    }
    
    function redirectToBlogPost() {
        router.push(`/user/${router.query.userId}/blog/post?id=${blogId}`);
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
        router.push(`/user/${router.query.userId}/blog`);
    }

    const confirmationCancel = () => {
        document.getElementById("blur-container")!.style.visibility = 'hidden';
        removeBlur();
    }

    const[postContent, setPostContent] = useState(blogPost ? blogPost.content : "");
    const[postTitle, setPostTitle] = useState(blogPost ? blogPost.title : "");
    const [isReady, setIsReady] = useState(false);

    if(isReady)
    {
        document.getElementById("blog-post-full-content")!.innerText = blogPost ? blogPost.content : "";
        document.getElementById("blog-post-title")!.innerText = blogPost ? blogPost.title : "";
        if(!sessionData || (sessionData?.user?.id !== blogPost?.authorId))
        {
            router.push("/oops/unallowed");
        }
    }

    useEffect(() => {
        setChecked(initPublished);
        setIsReady(true);
    },[])

    return(<div className={"absolute"}>
                <div className="total-container" id="edit-post-total">
                    <Header />
                    <div className="content-container" id="blog-post-full-outer">
                        <div id="blog-post-full-options">
                            <button id="gen-btn" onClick={redirectToBlogPost}>Back</button>
                            <button id="gen-btn" onClick={saveAndRedirect}>Save</button>
                            <button id="gen-btn" onClick={handleDelete}>Delete</button>
                            <div className="flex flex-col text-center" id="gen-panel">  
                                <h1>Publish</h1>
                                <input checked={checked} id="public-box" type={"checkbox"} onChange={handleChecked}></input>
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
            </div>);
}

export default EditBlogPost;