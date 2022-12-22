import {NextPage} from "next";
import {useRouter} from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {trpc} from "../../../../utils/trpc";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";

type tagsProps = {
    tagId: string
}

const Tags: React.FC<tagsProps> = (props: tagsProps) => {
    const {data: tag} = trpc.blog.getHashtagById.useQuery({id: props.tagId});
    return(
        <>
            <div className={" border-solid border-2 rounded-lg border-black p-1 cursor-pointer hover:underline hoverable-button"}>
                {tag ? tag.value : "No tags."}
            </div>
        </>)
}

const Post: NextPage = () => {
    const router = useRouter();
    const blogId = String(router.query.id);

    const {data: junctions} = trpc.blog.getHashtagIdsFromJunction.useQuery({blogId: blogId});
    const tagEles: any = []
    if(junctions != undefined)
    {   
        let i = 0;
        for(const junction of junctions)
        {
            const currTag = (<Tags tagId={junction ? junction.hashtagId : "undefined"} key={i} />)
            tagEles.push(currTag)
            i++;
        }
    }
    const { data: sessionData} = useSession();
    const { data: fullBlogPost } = trpc.blog.getBlogPostById.useQuery({id: blogId});
    const user = trpc.user.getUserNameById.useQuery({id: fullBlogPost ? fullBlogPost.authorId : ""})
    const numberOfDigits = String(router.query.id).length;
    const newUrl = router.asPath.slice(0, router.asPath.length - numberOfDigits - 9);
    const date = fullBlogPost?.updatedAt;
    const filteredDate = getGoodDateFromDbOutput(String(date));
    function getGoodDateFromDbOutput(input: string)
    {       
        /*
        // Format:
        // Fri Nov 25 2022 18:47:25 GMT-0600 (Central Standard Time) 
        */

        let tokens = input.split(" ");
        tokens = tokens.slice(0, 5);

        const result = tokens[0] + " " + tokens[1] + " " + tokens[2] + " " + tokens[3] + " " + tokens[4];
        return result;
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

    const[isReady, setIsReady] = useState(false);

    useEffect(() => {
        if(fullBlogPost)
            setIsReady(true);

    },)

    useEffect(() => {
        if(document.getElementById("blog-post-full-title") != null)
            document.getElementById("blog-post-full-title")!.innerHTML = blogPostTitle;
        if(document.getElementById("blog-post-full-content") != null)
            document.getElementById("blog-post-full-content")!.innerHTML = blogPostContent;
    });

    const mainContent = (
       <div className="total-container">
            <Header />
            <div className="content-container" id="blog-post-full-outer">
                <div id="blog-post-full-options">
                    <button className={"flex-grow bg-white p-4 border-2 border-solid rounded-lg border-black hoverable-button"} id="gen-btn" onClick={redirectBackToMainBlog}>Back</button>
                    { authorized() && (<button className={"flex-grow bg-white p-4 border-2 border-solid rounded-lg border-black  hoverable-button"} id="gen-btn" onClick={redirectToEditBlogPost}>Edit</button>)}
                </div>
                <div className={"relative flex flex-row flex-wrap gap-4 p-2 bg-white bg-opacity-90 w-2/5 left-0 right-0 m-auto mt-2"}>
                    <div>Tags: </div>
                    {tagEles}
                </div>
                <div id="blog-post-full-container">
                    <h1 id="blog-post-full-title"/>
                    <h2>{`Written By: ${user.data?.name}`}</h2>
                    <h2>{`Last Edited ${filteredDate}`}</h2>
                    <br></br>
                    <div id="blog-post-full-content" />
                </div>
            </div>
        </div>
    );

    const loading = (<Loading />);

    return(
        <>
            {isReady ? mainContent : loading}
        </>
    );
}

export default Post;
