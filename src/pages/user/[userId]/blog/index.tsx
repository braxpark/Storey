import {NextPage} from "next";
import { useRouter } from "next/router";
import {useSession, signIn} from "next-auth/react"
import {useEffect, useState} from "react";
import Header from "../../../components/Header";
import {trpc} from "../../../../utils/trpc";


const UserBlog: NextPage = () => {
    const router = useRouter();
    const id = router.query.userId;

    const {data: sessionData} = useSession();
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        if(sessionData)
        {
            if(sessionData?.user?.id == id)
            {
                setAuth(true);
            }
        }
    },)

    type BlogPanelProps = {
    id: number,
    title: string,
    authorName: string | null,
    }

    const BlogPanel: React.FC<BlogPanelProps> = (props: BlogPanelProps) => {
        const router = useRouter();

        function redirectToSpecificBlogPost() {
            const url = router.asPath + `/post?id=${props.id}`;
            router.push(url);
        }

        return(
            <div className="blog-panel-container" onClick={redirectToSpecificBlogPost}>
                <h1 id="blog-panel-title">{props.title}</h1>
                <br></br>
                <h3>{`Written by: ${props.authorName}`}</h3>
            </div>
        );
    }

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

    function goToCreatePost() {
        router.push(`/user/${id}/blog/createpost`);
    }

    return(
        <>
            {auth && (
                <>
                    <Header />
                    <div className={"content-container"}>
                        <div id="blog-panels-options">
                            <button id="gen-btn" className="text-xs" onClick={goToCreatePost}>
                                Create a Post
                            </button>
                        </div>
                        <div id="blog-panel-list">
                            {blogPanelsArr}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default UserBlog;