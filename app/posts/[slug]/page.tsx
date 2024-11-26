import { getAllPosts } from "@/app/lib/posts";
import { notFound } from "next/navigation";
import MarkdownIt from "markdown-it"
import styles from "@/app/posts/post.module.css"

type Params = { slug : string }

const md = new MarkdownIt({
    html: true,  // Enable HTML rendering
    linkify: true,
    typographer: true
  })

const fetchPosts = async (slug : string) => {
    const posts = getAllPosts()
 
    return posts.find(post => post.slug === slug)
}

export default async function Post ({ params } : { params: Params}){
    const post = await fetchPosts(params.slug)

    if (!post) notFound()

    const htmlContent = md.render(post.content)

    const headings = extractHeadings(htmlContent)

    
    return (
        <article className={styles.article}>
            <h1 className="">{post.header.title}</h1>
            <p className="post-meta">{post.header.date}</p>
            <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </article>
    )
}