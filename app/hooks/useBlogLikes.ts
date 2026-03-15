import { useQuery } from "@tanstack/react-query"
import { fetchBlogLikesFromServer } from "../actions/blogAction"
import { Issue } from "@prisma/client"

const useBlogLikes = (blog: Issue) =>
  useQuery<number, Error>({
    queryKey: ["likes", blog.id],
    queryFn: () => fetchBlogLikesFromServer(blog.id),
    initialData: blog.likes,
    onError: (error) => {
      console.error("Error fetching blog likes:", error)
    },
  })

export default useBlogLikes
