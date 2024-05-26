import prisma from "@/prisma/client";
import React from "react";

const getData = async () => {
  return await prisma.issue.findMany();
};

const staticData = async () => {};

export const blogs = getData();
export default staticData;

export const dynamic = "force-static";
