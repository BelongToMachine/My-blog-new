import { useQuery } from "@tanstack/react-query"
import { fetchBlogLikesFromServer } from "../actions/blogAction"
import { Issue } from "@prisma/client"

const useBlogLikes = (issue: Issue) =>
  useQuery<number, Error>({
    queryKey: ["likes", issue.id],
    queryFn: () => fetchBlogLikesFromServer(issue.id),
    initialData: issue.likes,
    onError: (error) => {
      console.error("Error fetching issue:", error)
    },
  })

export default useBlogLikes
