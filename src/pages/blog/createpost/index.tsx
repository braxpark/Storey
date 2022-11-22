import {NextPage} from "next";

import {useRouter} from "next/router";
import { useState} from "react";
import Header from "../../components/Header";
import {trpc} from "../../../utils/trpc";
import { useSession } from "next-auth/react";
const CreateBlogPost: NextPage = () => {
    const [isCreating, setIsCreating] = useState(false);
    let newBlogId = 0;
    const {data: checkBlogIdRes} = trpc.blog.getIfBlogIdExists.useQuery(({id: newBlogId}));
    const router = useRouter();
    const { data: sessionData} = useSession();
    const mutation = trpc.blog.createBlogPost.useMutation();
    function redirectToBlogPost() {
        router.push("/blog");
    }

    const createAndRedirect  = async () => {
        // need id for blog
        // need to create date object for mutation
        const title = String(document.getElementById("blog-post-title")?.innerText);
        const content = String(document.getElementById("blog-post-full-content")?.innerText);
        const checkBox = document.getElementById("public-box") as HTMLInputElement;
        const currentDate = new Date();
        const authId = String(sessionData?.user?.id);
        const authorName = String(sessionData?.user?.name);
        console.log(`Author name is: ${authorName}`);
        const getRandomInteger = () => { return Math.floor((Math.random() * (100000000 - 0) + 0))}
        let validBlogId = false;
        while(!validBlogId)
        {
            newBlogId = getRandomInteger();
            if(checkBlogIdRes == null)
            {
                validBlogId = true;
            }

        }
        await mutation.mutateAsync({id: newBlogId, title: title, content, public: checkBox.checked, createdAt: currentDate, authorId: authId, authorName: authorName});
        redirectToBlogPost();
    }

    return(
        <div className="total-container">
            <Header />
            <div className="content-container" id="blog-post-full-outer">
                <div id="blog-post-full-options">
                    <button id="gen-btn" onClick={redirectToBlogPost}>Back</button>
                    <button id="gen-btn" onClick={createAndRedirect}>Create</button>
                    <div className="flex flex-col text-center" id="gen-panel">  
                        <h1>Publish</h1>
                        <input id="public-box" type={"checkbox"}></input>
                    </div>
                </div>
                <div id="blog-post-full-container">
                    <div contentEditable={true} id="blog-post-title" className="blog-post-full-editable text-xs">
                    </div>
                    <br></br>
                    <div contentEditable={true} id="blog-post-full-content" className="blog-post-full-editable">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBlogPost;