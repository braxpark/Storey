import { NextPage } from "next/types";
import Header from "../components/Header";
import {trpc} from "../../utils/trpc";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import ReactDOM from "react-dom";

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
        function logPage () { console.log(`Page is: ${page}`); }
        function goNextPage () {
            if(page < Number(numberOfPosts) / numberOfPostsPerPage)
                setPage(page+1);
            logPage();
        }

        function goPrevPage () {
            if(page > 1)
                setPage(page-1);
            logPage();
        }
        return(
            <div className={"relative bg-transparent w-11/12 explore-footer-height left-0 right-0 bottom-0 m-auto mt-8 flex flex-row justify-center items-center gap-8 p-2 z-30"}>
                <button className={"bg-white border-2 border-black h-12 p-2 hoverable-button"} onClick={goPrevPage}>Prev Page</button>
                <button className={"bg-white border-2 border-black h-12 p-2 hoverable-button"} onClick={goNextPage}>Next Page</button>
            </div>
        );
    }

    const ExplorerHeader: React.FC = () => {
        function handleFilterChange(e: any) {
            setFilterValue(e.target.value);
            localStorage.setItem("filter", e.target.value);
        }
        return(
            <div className={"flex flex-row justify-center items-center bg-white w-11/12 left-0 right-0 m-auto mt-8 explore-header-height z-30 rounded-lg border-solid border-2 border-black gap-2"}>
                <div className={"bg-white bg-opacity-40 h-12 flex flex-col justify-center explore-header-options"}><p className={"p-4"}>Filter By:</p></div>
                <select value={filterValue} onChange={(event) => handleFilterChange(event)} id="filter-select" className={"bg-white bg-opacity-40 h-12 explore-header-options-interact"}>
                    <option value="no-filter">No Filter</option>
                    <option value="recent">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="author">Author</option>
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
        const {data: currentPagePostsRes} = trpc.blog.getRangeOfPublishedPostsWithOffsetAndStride.useQuery({offset: offset, stride: maxNumEntriesPerPage})
        
        const getArrOfBlogPostsFromQueryResult = (blogPostResult: any) => {
            const blogPanels: any = [];
            if(blogPostResult)
            {
                for(const blogPost of blogPostResult)
                {
                    blogPanels.push(<BlogTile title={blogPost.title} author={blogPost.authorName} preview={"Test Preview"} key={blogPost.title} />);
                }
            }
            return blogPanels;
        }

        let blogPanelsArr: any = [];
        /*
        if(currentPagePostsRes)
        {
            for(const blogPost of currentPagePostsRes)
            {
                const blogPanel = (<BlogTile title={blogPost.title} author={blogPost.authorName} preview={"Test Preview"} key={blogPost.title} />);
                blogPanelsArr.push(blogPanel);
            }
        }
        */
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
        case "author":
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
    preview?: string,
}
    const BlogTile: React.FC<BlogTileProps>= (props: BlogTileProps) => {
        return(
            <div  className={`blog-tile bg-white w-full blog-tile-height flex-grow mt-0 mb-0 m-auto flex flex-col gap-1 p-2 rounded-lg border-black border-solid border-2`}>
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
    return(
        <div className="total-container">
            <Header />
            <div className={"content-offset"}>
                <div className={"absolute bg-white bg-opacity-40 w-5/6 min-height-100 left-0 right-0 m-auto"}>
                    <ExplorerHeader></ExplorerHeader>
                    <BlogList page={page}></BlogList>
                    <ExplorerFooter></ExplorerFooter>
                </div>
            </div>
        </div>
    );
}

export default Explore;

// TODO : redo styling for explore page; maybe break up each page into a new route??