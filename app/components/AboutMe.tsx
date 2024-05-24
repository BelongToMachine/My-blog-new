import {
  AspectRatio,
  Badge,
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
} from "@radix-ui/themes";
import React from "react";
import selfie from "@/public/images/selfie.png"; // Update the image import
import Image from "next/image";
import { Color, colors } from "./color";
import { TypeAnimation } from "react-type-animation";

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
            <Heading color="sky">Eduction</Heading>
            <Badge color="ruby">GuangZhou University</Badge>
          </Flex>
        </Card>
      </Box>
    </div>
  );
};

const skills: string[] = ["JavaScript", "NodeJS", "TypeScript", "Python"];

const generateRandomColor: () => Color = () => {
  return colors[Math.floor(Math.random() * colors.length)] as Color;
};

export default AboutMePage;
