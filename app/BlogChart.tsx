"use client";
import { Card } from "@radix-ui/themes";
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const BlogChart = ({ open, inProgress, closed }: Props) => {
  const data = [
    { label: "Web开发", value: open },
    { label: "科技类", value: inProgress },
    { label: "非技术类", value: closed },
  ];

  return (
    <Card>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Bar
            dataKey="value"
            barSize={60}
            style={{ fill: "var(--accent-9)" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BlogChart;
