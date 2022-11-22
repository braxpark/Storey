import { NextPage } from "next/types";
import Header from "../components/Header";
import {trpc} from "../../utils/trpc";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import Blog from "../blog";

const Explore: NextPage = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { data: numberOfPosts} = trpc.blog.getNumberOfPublishedPosts.useQuery();

    type ExplorerFooterProps = {

    }
    const ExplorerFooter: React.FC<ExplorerFooterProps> = (props: ExplorerFooterProps) => {
        function logPage () { console.log(`Page is: ${page}`); }
        function goNextPage () {
            if(page < Number(numberOfPosts) / 10)
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
                <button className={"border-2 border-black h-12 p-2 hoverable-button"} onClick={goPrevPage}>Prev Page</button>
                <button className={"border-2 border-black h-12 p-2 hoverable-button"} onClick={goNextPage}>Next Page</button>
            </div>
        );
    }

    /*
    return(
        <div className="total-container">
            <Header />
            <div className={"content-offset"}>
                <div className={"absolute z-50 bg-red-500 bg-opacity-40 w-3/5 min-height-screen left-0 right-0 m-auto"}>
                    <div className={"mt-2 absolute left-0 right-0 m-auto min-h-full"}>
                        <ExplorerHeader />
                        <BlogList page={page}/>
                        <ExplorerFooter />
                    </div>
                </div>
            </div>
        </div>
    );
    */
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

const ExplorerHeader: React.FC = () => {
    return(
        <div className={" w-full left-0 right-0 m-auto explore-header-height z-30"}>
                &nbsp;
        </div>
    );
}

type BlogListProps = {
    page: number
}

const BlogList: React.FC<BlogListProps> = (props: BlogListProps) => {
    const maxNumEntriesPerPage = 10;
    const offset = (props.page - 1) * maxNumEntriesPerPage;
    const {data: currentPagePostsRes} = trpc.blog.getRangeOfPublishedPostsWithOffsetAndStride.useQuery({offset: offset, stride: maxNumEntriesPerPage})
    const blogPanelsArr: any = [];
    if(currentPagePostsRes)
    {
        for(const blogPost of currentPagePostsRes)
        {
            const blogPanel = (<BlogTile title={blogPost.title} author={blogPost.authorName} preview={"Test Preview"} key={blogPost.title} />);
            blogPanelsArr.push(blogPanel);
        }
    }
    return(
        <div id="explore-blog-list" className={"relative w-11/12 height-92 left-0 right-0 m-auto mt-8 flex flex-col items-center justify-center gap-2"}>
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
        <div  className={`blog-tile w-full blog-tile-height flex-grow mt-0 mb-0 m-auto flex flex-col gap-1 p-2 rounded-lg border-black border-solid border-2`}>
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

// TODO : redo styling for explore page; maybe break up each page into a new route??