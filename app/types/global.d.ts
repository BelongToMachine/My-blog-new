declare const COLORS_JIE_BLOG_THEME: {
    light: {
      primary: string;
      text: string;
      background: string;
      scrollableBackground: string;
      border: string;
      cardBackground: string;
      chartText: string;
      link: string;
      tableHeader: string;
      tableGeneral: string;
    };
    dark: {
      primary: string;
      text: string;
      background: string;
      scrollableBackground: string;
      border: string;
      cardBackground: string;
      chartText: string;
      link: string;
      tableHeader: string;
      tableGeneral: string;
    };
  };

declare function GET_JIE_BLOG_CSS_PROPERTIES(colorMode: "light" | "dark"): Record<string, string>;

  