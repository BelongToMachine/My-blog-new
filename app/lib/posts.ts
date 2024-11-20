import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
  slug: string,
  content?: string,
  header: ArticleHeader
}

export interface ArticleHeader {
  title: string,
  date: string,
  author: string
}

const postsDirectory = path.join(process.cwd(), "app", "posts");

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const filePath = path.join(postsDirectory, fileName) ;
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const header = data as ArticleHeader

    return {
      slug,
      header,
      content,
    };
  });
}
