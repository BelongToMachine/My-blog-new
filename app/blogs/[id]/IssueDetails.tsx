import { IssueStatusBadge, Link } from "@/app/components";
import styles from "@/app/posts/post.module.css";
import { Issue } from "@prisma/client";
import { Box, Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { v4 as uuidv4 } from "uuid";
import TableOfContent from "../_components/TableOfContent";

interface ArticleHeader {
  title: string;
  date: string;
  author: string;
}
export interface Heading {
  text: string;
  level: number;
  id: string;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

md.renderer.rules.heading_open = function (tokens, idx) {
  const token = tokens[idx];
  const level = token.tag.slice(1); // Get header level, e.g., h1 -> 1
  const content = tokens[idx + 1].content; // Get the content of the header

  // Convert the header content to an ID-friendly format (lowercase and replace spaces with hyphens)
  const id = uuidv4();

  // Add the ID attribute to the header tag
  token.attrSet("id", id);

  return `<h${level} id="${id}">${content}</h${level}>`;
};

function extractHeadings(htmlContent: string): Heading[] {
  const headingRegex = /<h([2])\s*(?:id="([^"]*)")?[^>]*>([^<]+)<\/h\1>/g;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const [, levelStr, existingId, text] = match;
    const level = parseInt(levelStr);
    const id = existingId || `heading-${headings.length}`;

    headings.push({
      text: text.trim(),
      level,
      id,
    });
  }

  return headings;
}

const IssueDetails = ({ issue }: { issue: Issue }) => {
  const { data, content } = matter(issue.description);
  const header = data as ArticleHeader;
  const htmlContent = md.render(content);

  const headings = extractHeadings(htmlContent);

  return (
    <Flex
      className="w-full p-6"
      style={{ gap: "1rem" }}
      direction={{ initial: "column", md: "row" }}
    >
      <Box className="flex-grow max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <Heading className="text-2xl font-bold">{issue.title}</Heading>
        <Flex className="space-x-4 mt-2 text-gray-600 text-sm" align="center">
          <IssueStatusBadge status={issue?.status} />
          <Text>{issue.createdAt.toDateString()}</Text>
        </Flex>
        <Card className="prose max-w-none mt-4">
          <article className={styles.article}>
            <h1>{header.title}</h1>
            <p className="post-meta">{header.date}</p>
            <div
              id="post-content"
              className="post-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>
        </Card>
      </Box>

      <Box
        className="flex-shrink-0 w-full max-w-sm rounded-lg p-4"
        style={{ height: "fit-content" }}
      >
        <TableOfContent headings={headings} />
      </Box>
    </Flex>
  );
};

export default IssueDetails;
