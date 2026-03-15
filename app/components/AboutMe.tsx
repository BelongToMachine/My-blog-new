import { Badge, Box, Card, Flex, Heading } from "@radix-ui/themes";
import React from "react";
import { Color, colors } from "./color";
import { useTranslations } from "next-intl";

const AboutMePage = () => {
  const t = useTranslations("skills");
  return (
    <div className="container mx-auto py-2">
      <Box className="flex flex-col space-y-4 mb-4">
        <Card>
          <Flex className="flex flex-wrap items-center" gap="3">
            <Heading className="shrink-0" color="sky">
              {t("heading")}
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
            <Heading color="sky">{t("toolkits")}</Heading>
            {toolkits.map((toolkit) => (
              <Badge key={toolkit} color={generateRandomColor()}>
                {toolkit}
              </Badge>
            ))}
          </Flex>
        </Card>
        <Card>
          <Flex className="flex flex-wrap items-center" gap="3">
            <Heading color="sky">{t("education")}</Heading>
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
  "Tailwind",
  "Django",
  "Express",
  "webpack",
  "gulp",
  "git",
  "...",
];

const generateRandomColor: () => Color = () => {
  return colors[Math.floor(Math.random() * colors.length)] as Color;
};

export default AboutMePage;
