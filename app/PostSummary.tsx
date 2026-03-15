import { Flex, Grid } from "@radix-ui/themes"
import BlogSummary from "./BlogSummary"
import BlogChart from "./BlogChart"
import LatestBlogs from "./LatestBlogs"
interface Props {
  web: number
  tech: number
  nonTech: number
}

const PostSummary = ({ web, tech, nonTech }: Props) => {
  return (
    <Grid columns={{ initial: "1", lg: "2" }} gap="6" mt="8">
      <Flex direction="column" gap="6">
        <BlogSummary open={web} inProgress={tech} closed={nonTech} />
        <BlogChart open={web} inProgress={tech} closed={nonTech} />
      </Flex>
      <LatestBlogs />
    </Grid>
  )
}

export default PostSummary
