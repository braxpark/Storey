import {NextPage} from "next";
import {useRouter} from "next/router";
import { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import {trpc} from "../../../../../utils/trpc";
import { useSession, signIn } from "next-auth/react";
const CreateBlogPost: NextPage = () => {
    const router = useRouter();
    const { data: sessionData} = useSession();
    const mutation = trpc.blog.createBlogPost.useMutation();
    const createHashTagMutation = trpc.blog.createHashTagIfNotExists.useMutation();
    const createJunction = trpc.blog.addBlogHash.useMutation();
    const userId = router.query.userId;
    const authId = String(sessionData?.user?.id);
    const hashType: string[] = []
    const [hashtags, setHashtags] = useState(hashType)
    const [assignedTags, setAssignedTags] = useState(["No tags yet."]);
    function redirectToBlogPost() {
        router.push(`/user/${userId}/blog`);
    }

    const createAndRedirect  = async () => {
        // need id for blog
        // need to create date object for mutation
        const title = String(document.getElementById("blog-post-title")?.innerText);
        if(title == "") {
            return;
        }
        const content = String(document.getElementById("blog-post-full-content")?.innerText);
        const checkBox = document.getElementById("public-box") as HTMLInputElement;
        const currentDate = new Date();
        const authorName = String(sessionData?.user?.name);
        const blogPost = await mutation.mutateAsync({title: title, content, public: checkBox.checked, createdAt: currentDate, authorId: authId, authorName: authorName});
        for(const hashtag of hashtags)
        {
            // add hashtag to post
            // on blog id, add with connectOrCreate
            const hashRes = await createHashTagMutation.mutateAsync({value: hashtag});
            const junctionRes = await createJunction.mutateAsync({blogId: blogPost.id, hashtagId: hashRes.id});
        }
        redirectToBlogPost();
    }

    async function getHashtags() {
            // fetch -> setHashtags
            if(String(document.getElementById("blog-post-full-content")?.innerText) == "") return;
            const url = 'https://api.openai.com/v1/completions'
            const headerData = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_SECRET}`
            }
            const n = 3
            const content = String(document.getElementById("blog-post-full-content")?.innerText);
            const prompt = `Give exactly and only ${3} hashtags based on the following text: ${content}`
            const bodyData = {
                "model": "text-davinci-003",
                "prompt": prompt,
                "max_tokens": 20,
                "n": 1,
                "temperature": 0.9
            }
            await fetch(url, {
                method: 'POST',
                headers: headerData,
                body: JSON.stringify(bodyData)
            })
            .then(resp => resp.json())
            .then(res => {
                let newHashTags: string[] = []
                const strText = String(res.choices[0]['text'])
                newHashTags = strText.split(" ");
                setHashtags(newHashTags);
            })
    }
    function addHashTag(value: string){
        if(!assignedTags.includes(value))
        {
            if(assignedTags[0] == "No tags yet.")
                setAssignedTags(assignedTags.slice(1, assignedTags.length))
            else
                setAssignedTags([...assignedTags, value])
        }
        console.log(assignedTags)
    }

    function removeHashTags(value: string){
        const tags = hashtags;
        tags.filter((val) => { return value != val;})
    }

    type HashTagProps = {
        content: string
    }
    const HashTag: React.FC<HashTagProps> = (props: HashTagProps) => {
        return(
            <>
                <div onClick={() => {addHashTag(props.content)}} className={"flex-shrink border-black rounded-lg border-solid border-2 p-2 bg-white hoverable-button cursor-pointer"}>{props.content}</div>
            </>
        );
    }

    const GenHashTags: React.FC = () => {
        const hashtagList: any[] = [];
        let idx = 0;
        for(const hashTag of hashtags) // hashtag -> String
        {   
            hashtagList.push(<HashTag key={idx} content={hashTag}/>)
            idx++;
        }
        return(
            <div className={"w-full flex flex-row gap-1 mt-8"}>
                {hashtagList}
            </div>
        );
    }
    
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        setIsReady(true);
    }, [])

    if(isReady)
    {
        if(!sessionData || (userId != authId))
        {
            signIn();
        }
    }

    return(
        <div className="total-container">
            <Header />
            <div className="content-container" id="blog-post-full-outer">
                <div id="blog-post-full-options">
                    <button className={"bg-white flex-grow p-4 border-2 border-solid rounded-lg border-black hoverable-button"} id="gen-btn" onClick={redirectToBlogPost}>Back</button>
                    <button className={"bg-white flex-grow p-4 border-2 border-solid rounded-lg border-black hoverable-button"} id="gen-btn" onClick={createAndRedirect}>Create</button>
                    <div className={"cursor-pointer flex-grow flex flex-col text-center bg-white p-4 border-2 border-solid rounded-lg border-black hoverable-button"}>  
                        <h1>Publish</h1>
                        <input className={"cursor-pointer"} id="public-box" type={"checkbox"}></input>
                    </div>
                </div>
                <div id="blog-post-full-container">
                    <div>
                        {assignedTags}
                    </div>
                    <div contentEditable={true} id="blog-post-title" className="blog-post-full-editable text-xs" />
                    <br></br>
                    <div contentEditable={true} id="blog-post-full-content" className="blog-post-full-editable">
                    </div>
                    <div className={"flex flex-row gap-2 w-4/5"}>
                        <button onClick={getHashtags} className={"border-black rounded-lg border-solid border-2 p-2 bg-white mt-2 hoverable-button"}>Generate Hashtags</button>
                        <div className={"flex flex-col justify-center"}>
                            OR
                        </div>
                        <div className={"relative border-black rounded-lg border-solid border-2 p-2 bg-white mt-2 w-11/12 flex flex-row items-center"}>
                            <div id="tags-textbox" className={"text-2xl text-gray-600 text-opacity-50"}>
                                Tags..
                            </div>
                            <div id="typing-tags" contentEditable={true} onFocus={() => {document.getElementById("tags-textbox")!.style.visibility='hidden'}} className={"absolute text-2xl min-w-full left-0 m-auto min-h-full flex flex-row items-center "}>

                            </div>
                        </div>
                        <button onClick={()=> addHashTag("#" + document.getElementById("typing-tags")!.innerText)} className={"border-black border-solid border-2 rounded-lg mt-2 p-2 bg-white hoverable-button"}>
                            Add Tag
                        </button>
                    </div>
                    <div>
                        <GenHashTags />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBlogPost;