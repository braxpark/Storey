import { NextPage } from "next/types";
import Header from "../components/Header";
import Loading from "../components/Loading";
import {trpc} from "../../utils/trpc";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

const Explore: NextPage = () => {
    const router = useRouter();
    const numberOfPostsPerPage = 10;
    const [page, setPage] = useState(1);
    const { data: numberOfPosts} = trpc.blog.getNumberOfPublishedPosts.useQuery();
    const blogAuthor = "claikl0ii0000uml0qxbsfd3b";
    let initFilter;
    if(typeof window !== 'undefined')
        initFilter = localStorage.getItem("filter");
    const[filterValue, setFilterValue] = useState(initFilter ? initFilter : "no-filter");
    const ExplorerFooter: React.FC = () => {
        function goNextPage () {
            if(page < Number(numberOfPosts) / numberOfPostsPerPage)
                setPage(page+1);
        }

        function goPrevPage () {
            if(page > 1)
                setPage(page-1);
        }
        //let btnBgColorPrev = (page == 1 || page == (Number(numberOfPosts) / numberOfPostsPerPage + 1)) ? "bg-red-400" : "bg-white";
        const prevBtnBgColor = (page == 1) ? "bg-gray-600" : "bg-white";
        const nextBtnBgColor = (page == (Math.floor(Number(numberOfPosts) / numberOfPostsPerPage) + 1)) ? "bg-gray-600" : "bg-white";
        return(
            <div className={"relative bg-transparent w-11/12 explore-footer-height left-0 right-0 bottom-0 m-auto mt-8 flex flex-row justify-center items-center gap-8 p-2 z-30"}>
                <button className={`${prevBtnBgColor} border-2 border-black h-12 p-2 hoverable-button`} onClick={goPrevPage}>Prev Page</button>
                <button className={`${nextBtnBgColor} border-2 border-black h-12 p-2 hoverable-button`} onClick={goNextPage}>Next Page</button>
            </div>
        );
    }

    const ExplorerHeader: React.FC = () => {
        function handleFilterChange(e: any) {
            setFilterValue(e.target.value);
            localStorage.setItem("filter", e.target.value);
        }
        return(
            <div className={"flex flex-row justify-center items-center bg-white w-11/12 left-0 right-0 m-auto mt-8 explore-header-height z-30 rounded-lg gap-2"}>
                <div className={"h-12 flex flex-col justify-center explore-header-options"}><p className={"p-4"}>Filter By:</p></div>
                <select value={filterValue} onChange={(event) => handleFilterChange(event)} id="filter-select" className={"h-12 explore-header-options-interact"}>
                    <option value="no-filter">No Filter</option>
                    <option value="recent">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>
        );
    }  
    
type BlogListProps = {
    page: number
}

    const BlogList: React.FC<BlogListProps> = (props: BlogListProps) => {
        const maxNumEntriesPerPage = numberOfPostsPerPage;
        const offset = (props.page - 1) * maxNumEntriesPerPage;
        
        const getArrOfBlogPostsFromQueryResult = (blogPostResult: any) => {
            const blogPanels: any = [];
            if(blogPostResult)
            {
                for(const blogPost of blogPostResult)
                {
                    blogPanels.push(<BlogTile title={blogPost.title} authorId={blogPost.authorId} blogId={blogPost.id} author={blogPost.authorName} key={blogPost.title} />);
                }
            }
            return blogPanels;
        }

       let blogPanelsArr: any = [];
       switch(filterValue)
       {
        case "no-filter":
            {
                const {data: currentPagePostsRes} = trpc.blog.getRangeOfPublishedPostsWithOffsetAndStride.useQuery({offset: offset, stride: maxNumEntriesPerPage});
                blogPanelsArr = getArrOfBlogPostsFromQueryResult(currentPagePostsRes);
                break;
            }
        case "recent":
            {   
                const { data: currentPagePostsRes} = trpc.blog.getPublishedPostsWithOffsetAndStrideByDateDesc.useQuery({offset: offset, stride: maxNumEntriesPerPage});
                blogPanelsArr = getArrOfBlogPostsFromQueryResult(currentPagePostsRes);
                break;
            }
        case "oldest":
            {
                const { data: currentPagePostsRes} = trpc.blog.getPublishedPostsWithOffsetAndStrideByDateAsc.useQuery({offset: offset, stride: maxNumEntriesPerPage});
                blogPanelsArr = getArrOfBlogPostsFromQueryResult(currentPagePostsRes);
                break;
            }
        case "author": // WIP need trie like accessing?
            {
                const { data: currentPagePostsRes} = trpc.blog.getPublishedPostsWithOffsetAndStrideByAuthor.useQuery({offset: offset, stride: maxNumEntriesPerPage, authorId: blogAuthor});
                blogPanelsArr = getArrOfBlogPostsFromQueryResult(currentPagePostsRes);
                break;
            }
       }
        return(
            <div id="explore-blog-list" className={"relative w-11/12 height-92 left-0 right-0 m-auto mt-2 flex flex-col items-center justify-center gap-1"}>
                {blogPanelsArr}
            </div>
        );
    }

type BlogTileProps = {
    title: string,
    author?: string | null,
    authorId?: string | null,
    blogId?: number | null,
    preview?: string,
}
    const BlogTile: React.FC<BlogTileProps>= (props: BlogTileProps) => {
        function redirectToPost()
        {
            const redirectUrl = `/user/${props.authorId}/blog/post?id=${props.blogId}`;
            router.push(redirectUrl);
        }
        return(
            <div onClick={redirectToPost} className={`blog-tile bg-white w-full blog-tile-height flex-grow mt-0 mb-0 m-auto flex flex-col gap-1 p-2 rounded-lg border-black border-solid border-1 duration-500 ease-linear`}>
                <h1 className={"text-sm mt-0"}>{props.title}</h1>
                {props.author && (
                    <h2 className={"text-xs absolutet"}>Written by: {props.author}</h2>
                )}
                {props.preview && (
                    <p className={"text-xs"}>{props.preview}</p>
                )}
            </div>
        );
    }    

    const mainContent = (
                <div className={"absolute bg-white bg-opacity-40 w-5/6 min-height-100 left-0 right-0 m-auto"}>
                    <ExplorerHeader></ExplorerHeader>
                    <BlogList page={page}></BlogList>
                    <ExplorerFooter></ExplorerFooter>
                </div>
    );

    const loading = (
            <Loading />
    );
    const[isReady, setIsReady] = useState(false);
    
    useEffect(() => {
            if(numberOfPosts || numberOfPosts==0)
                setIsReady(true);
    },)
    return(
        <>
            <div className="total-container">
                <Header />
                <div className={"content-offset"}>
                    {isReady ? mainContent : loading}
                </div>
            </div>
        </>
    );
}

export default Explore;