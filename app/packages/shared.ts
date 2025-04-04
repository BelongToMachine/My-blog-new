import type { JSX } from 'react'
import type { BundledLanguage, BundledTheme, StringLiteralUnion } from 'shiki'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { codeToHast } from 'shiki'
import type { Root } from 'hast'

export interface ShikiProp {
    children: string;
    lang: BundledLanguage;
    theme?: StringLiteralUnion<BundledTheme, string>;
}

export async function highlight({children : code, lang, theme="github-dark"} : ShikiProp) {
  const out = await codeToHast(code, {
    lang,
    theme: theme,
  })

  // Modify the pre element's style
  if (out.children[0] && out.children[0].type === 'element' && out.children[0].tagName === 'pre') {
    const existingStyle = out.children[0].properties?.style 
      ? String(out.children[0].properties.style)
      : '';

    out.children[0].properties = {
      ...out.children[0].properties,
      style: `${existingStyle}; width: 100%; height: 100%`
    }
  }

  return toJsxRuntime(out as Root, {
    Fragment,
    jsx: jsx as any,
    jsxs: jsxs as any,
  }) as JSX.Element
}