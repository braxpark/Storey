import { NextPage } from "next/types";
import Header from "../components/Header";
import {trpc} from "../../utils/trpc";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import ReactDOM from "react-dom";

const Explore: NextPage = () => {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const { data: numberOfPosts} = trpc.blog.getNumberOfPublishedPosts.useQuery();
    return(
        <div className="total-container">
            <Header />
            <div className={"content-offset"}>
                <div className={"absolute z-50 bg-gray-600 bg-opacity-50 w-3/5 min-height-100 left-0 right-0 m-auto"}>
                    <ExplorerHeader />
                    <BlogList page={page}/>
                    <ExplorerFooter />
                </div>
            </div>
        </div>
    );
}

export default Explore;

const ExplorerHeader: React.FC = () => {
    return(
        <div className={"relative bg-white w-11/12 h-14 mt-8 left-0 right-0 m-auto"}>

        </div>
    );
}

type BlogListProps = {
    page: number
}

const BlogList: React.FC<BlogListProps> = (props: BlogListProps) => {
    const maxNumEntriesPerPage = 10;
    const offset = 0;
    const {data: currentPagePostsRes} = trpc.blog.getRangeOfPublishedPostsWithOffsetAndStride.useQuery({offset: 0, stride: maxNumEntriesPerPage})
    const blogPanelsArr: any = [];
    if(currentPagePostsRes)
    {
        for(const blogPost of currentPagePostsRes)
        {
            const blogPanel = (<BlogTile title={blogPost.title} author={blogPost.authorName} preview={"Test Preview"} />);
            blogPanelsArr.push(blogPanel);
        }
    }
    return(
        <div id="explore-blog-list" className={"blog-list relative bg-red-500 w-11/12 min-height-74 left-0 right-0 m-auto flex flex-col"}>
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
        <div className={`relative w-full bg-blue-400 border-white border-2 flex-grow` }>
            <h1>{props.title}</h1>
            {props.author && (
                <h2>Written by: {props.author}</h2>
            )}
            {props.preview && (
                <p>{props.preview}</p>
            )}
        </div>
    );
}

const ExplorerFooter: React.FC = () => {
    return(
        <div className={"relative bg-white w-11/12 h-14 left-0 right-0 m-auto"}>
            Hello!
        </div>
    );
}