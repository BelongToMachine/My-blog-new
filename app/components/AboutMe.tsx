import { Badge, Box, Card, Flex, Heading } from "@radix-ui/themes";
import React from "react";
import { Color, colors } from "./color";

const AboutMePage = () => {
  return (
    <div className="container mx-auto py-2">
      <Box className="flex flex-col space-y-4 mb-4">
        <Card>
          <Flex className="flex flex-wrap items-center" gap="3">
            <Heading className="shrink-0" color="sky">
              Skill
            </Heading>
            {skills.map((skill) => (
              <Badge key={skill} color={generateRandomColor()}>
                {skill}
              </Badge>
            ))}
          </Flex>
        </Card>
        <Card>
          <Flex className="flex flex-wrap items-center" gap="3">
            <Heading color="sky">Toolkits</Heading>
            {toolkits.map((toolkit) => (
              <Badge key={toolkit} color={generateRandomColor()}>
                {toolkit}
              </Badge>
            ))}
          </Flex>
        </Card>
        <Card>
          <Flex className="flex flex-wrap items-center" gap="3">
            <Heading color="sky">Eduction</Heading>
            <Badge color="ruby">GuangZhou University</Badge>
            <Badge color="ruby">广州大学</Badge>
          </Flex>
        </Card>
      </Box>
    </div>
  );
};

const skills: string[] = ["JavaScript", "NodeJS", "TypeScript", "Python"];

const toolkits: string[] = [
  "React",
  "NextJs",
  "MySql",
  "Vue",
  "Django",
  "Express",
  "gulp",
  "git",
  "...",
];

const generateRandomColor: () => Color = () => {
  return colors[Math.floor(Math.random() * colors.length)] as Color;
};

export default AboutMePage;
