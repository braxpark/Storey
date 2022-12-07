import {NextPage} from "next";
import { useRouter } from "next/router";
import {useSession, signIn} from "next-auth/react"
import {useEffect, useState} from "react";
import Header from "../../../components/Header";
import {trpc} from "../../../../utils/trpc";


const UserBlog: NextPage = () => {
    const router = useRouter();
    const id = String(router.query.userId);

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
    id: string,
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
            <div className="w-full blog-panel-container" onClick={redirectToSpecificBlogPost}>
                <h1 id="blog-panel-title">{props.title}</h1>
                <br></br>
                <h3>{`Written by: ${props.authorName}`}</h3>
            </div>
        );
    }

    const blogPanelsArr: any = [];
    const { data: blogPostRes} = trpc.blog.getAllPostsByAuthorId.useQuery({authorId: id});
    //const user = trpc.user.getUserNameById.useQuery({id: sessionData ? sessionData.user?.id : ""})
    const user = trpc.user.getUserNameById.useQuery({id: id});
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
   const [filter, setFilter] = useState("");

        function handleFilterChange(e: any) {
            setFilter(e.target.value);
            localStorage.setItem("filter", e.target.value);
        }

    return(
            <>
                <Header />
                <div className={"content-container"}>
                    <div className={"flex flex-col w-50 items-center justify-center"}>
                        <div className={"flex flex-row bg-white w-11/12 left-0 right-0 m-auto mt-8 explore-header-height z-30 rounded-lg justify-center items-center gap-12"}>
                            {auth && (
                            <button className="h-12 text-xs p-4 bg-white border-solid border-black border focus:text-black hover:rounded-lg hoverable-button" onClick={goToCreatePost}>
                                Create a Post
                            </button>)}
                            <div className={"flex flex-row gap-2"}>
                                <div className={"h-12 flex flex-col justify-center explore-header-options"}><p className={"p-4"}>Filter By:</p>
                                </div>
                                <select value={filter} onChange={(event) => handleFilterChange(event)} id="filter-select" className={"h-12 explore-header-options-interact"}>
                                    <option value="no-filter">No Filter</option>
                                    <option value="recent">Newest</option>
                                    <option value="oldest">Oldest</option>
                                </select>
                            </div>
                        </div>
                        <div className={"w-4/5"}>
                            {blogPanelsArr}
                        </div>
                    </div>
                </div>
            </>
    );
}
export default UserBlog;