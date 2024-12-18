function extractHeadings(htmlString, levels) {
  // Define a regular expression to match all <h1> to <h6> tags
  const headingRegex = /<h([1-6])\s*(?:id="([^"]*)")?[^>]*>([^<]+)<\/h\1>/g;

  const headings = [];
  let match;

  // Ensure levels is an array of integers for easier checking
  if (!Array.isArray(levels)) {
    levels = [levels]; // Convert to array if it's a single number
  }

  // Use regex to find all matches in the HTML string
  while ((match = headingRegex.exec(htmlString)) !== null) {
    const level = parseInt(match[1], 10); // Heading level (1 to 6)
    if (levels.includes(level)) {
      // Check if the heading level is in the specified levels
      headings.push({
        level: level,
        id: match[2] || null, // If no ID, use null
        content: match[3],
      });
    }
  }

  return headings;
}

// Example usage
const htmlString = `
  <h1>JQuery 基本语法与实践</h1>
  <h2>目录</h2>
  <h3>1. <a href="https://playcode.io/jquery">jQuery playground</a></h3>
  <h2>介绍</h2>
  <h3>2. <a href="https://playcode.io/javascript">在 js playground 中使用 jQuery</a></h3>
  <h3>基本语法：</h3>
  `;

console.log(extractHeadings(htmlString, 1)); // Extract only <h1> tags
console.log(extractHeadings(htmlString, [1, 2])); // Extract <h1> and <h2> tags
