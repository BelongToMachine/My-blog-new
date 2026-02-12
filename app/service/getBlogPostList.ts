import path from "path"
import fs from "fs/promises"
import matter from "gray-matter"

export async function getBlogPostList() {
  const fileNames = await fs.readdir(path.join(process.cwd(), "app/content"))

  console.log({ fileNames })

  const blogPosts: any = []

  for (let fileName of fileNames) {
    const rawContent = await fs.readFile(`app/content/${fileName}`)

    const { data: frontmatter } = matter(rawContent)

    console.log({ frontmatter })
  }

  //   for (let fileName of fileNames) {
  //     const rawContent = await fs.readFile(`app/content/${fileName}`)
  //     const  {data: frontMatter } = matter(rawContent)
  //     const slug = fileName.replace(/\.mdx$/, "")
  //     const post = await getBlogPost(slug)
  //     blogPosts.push(post)
  //   }

  return blogPosts
}

getBlogPostList()
