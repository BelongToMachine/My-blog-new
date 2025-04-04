import { JSX, useEffect, useRef, useState } from "react";
import { highlight, ShikiProp } from "./shared";
import React from "react";

export const ClientComponent = ({
  children,
  lang,
  initialTheme = "github-dark",
  colorMode = "dark",
}: ShikiProp & { initialTheme?: string; colorMode: string }) => {
  const [nodes, setNodes] = useState<JSX.Element>();
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    if (colorMode === "dark") {
      setTheme("vitesse-black");
    } else {
      setTheme("vitesse-light");
    }
  }, [colorMode]);

  useEffect(() => {
    void highlight({ children, lang, theme }).then(setNodes);
  }, [theme]);

  return nodes ?? <p className="text-gray-500">Loading...</p>;
};
