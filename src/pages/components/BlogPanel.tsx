import {useRouter} from "next/router";
export type BlogPanelProps = {
    id: number,
    title: string,
    authorName: string | null,
}

const BlogPanel: React.FC<BlogPanelProps> = (props: BlogPanelProps) => {
    const router = useRouter();

    function redirectToSpecificBlogPost() {
        router.push(`/blog/blogpost?post=${props.id}`)
    }

    return(
        <div className="blog-panel-container" onClick={redirectToSpecificBlogPost}>
            <h1 id="blog-panel-title">{props.title}</h1>
            <br></br>
            <h3>{`Written by: ${props.authorName}`}</h3>
        </div>
    );
}

export default BlogPanel;