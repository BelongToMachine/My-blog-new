const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();
const { v4: uuidv4 } = require("uuid");

// Custom rule to add an ID to each header element
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

// Example Markdown content
const markdown = `
# Hello World
this is a simple one
## This is a subheader
### Another subheader
`;

// Parse the Markdown to HTML with the custom ID generation
const result = md.render(markdown);
console.log(result);
