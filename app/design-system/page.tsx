"use client"
import React from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/app/components/ui/card'
import SectionHeading from '@/app/components/system/SectionHeading'
import { ActionIconButton } from '@/app/components/system/ActionIconButton'
import { PlusIcon } from '@radix-ui/react-icons'
import GeekPanel from '@/app/components/system/GeekPanel'
import { TerminalPill } from '@/app/components/system/TerminalPill'
import { CodeWindow } from '@/app/components/system/CodeWindow'

const DesignSystemPage = () => {
    const code = `export function CalloutBlock({ tone = "note", title, children }) {
  return (
    <aside data-tone={tone} className="border border-border bg-card">
      <header className="terminal-label">{title}</header>
      <div>{children}</div>
    </aside>
  )
}`

    return (
        <div className="container space-y-10 px-5 py-10 md:px-8 lg:px-10">
            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div className="space-y-5">
                    <p className="display-kicker">geek style / component library / v0.1</p>
                    <h1 className="pixel-heading max-w-4xl text-[clamp(1.9rem,5vw,4.2rem)]">Pixel Retro Components For Notes, Code, and Experiments.</h1>
                    <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                        Built on shadcn, then bent toward a pixel-retro workstation aesthetic: chunky borders, scanlines,
                        hard shadows, status lights, and content blocks that feel like an old dev terminal brought back to life.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <TerminalPill tone="cyan">workbench ui</TerminalPill>
                        <TerminalPill tone="amber">article system</TerminalPill>
                        <TerminalPill tone="rose">personal brand</TerminalPill>
                    </div>
                </div>
                <GeekPanel
                    eyebrow="system snapshot"
                    title="Design Constraints"
                    aside={<TerminalPill tone="cyan">active</TerminalPill>}
                >
                    <div className="grid gap-4 text-sm leading-7 text-muted-foreground">
                        <p><span className="text-foreground">Audience:</span> developers reading long-form technical notes.</p>
                        <p><span className="text-foreground">Tone:</span> experimental, precise, personal, tool-like.</p>
                        <p><span className="text-foreground">Stack:</span> Next.js, MDX content, shadcn primitives, Radix behavior.</p>
                    </div>
                </GeekPanel>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <GeekPanel eyebrow="palette" title="Signal Colors">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {[
                            ["background", "bg-background text-foreground border"],
                            ["card", "bg-card text-card-foreground border"],
                            ["primary", "bg-primary text-primary-foreground"],
                            ["secondary", "bg-secondary text-secondary-foreground"],
                            ["muted", "bg-muted text-muted-foreground"],
                            ["accent", "bg-accent text-accent-foreground"],
                            ["destructive", "bg-destructive text-destructive-foreground"],
                            ["ink", "bg-foreground text-background"],
                        ].map(([label, className]) => (
                            <div key={label} className={`min-h-24 border border-border/70 p-4 ${className}`}>
                                <div className="font-pixel text-[10px] uppercase tracking-[0.24em] opacity-80">{label}</div>
                            </div>
                        ))}
                    </div>
                </GeekPanel>
                <CodeWindow title="callout-block.tsx" language="tsx" code={code} />
            </section>

            <section className="space-y-6">
                <SectionHeading
                    title="Foundation Components"
                    description="The primitives below define the overall personality: compact controls, panel-based hierarchy, and typography that feels like an authoring tool."
                    align="left"
                />
                <div className="grid gap-6 xl:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Buttons</CardTitle>
                            <CardDescription>Primary actions look operational instead of decorative.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            <Button>Deploy Note</Button>
                            <Button variant="secondary">Queue Draft</Button>
                            <Button variant="outline">Open Panel</Button>
                            <Button variant="ghost">Ghost Link</Button>
                            <Button variant="destructive">Drop Task</Button>
                            <Button size="icon" aria-label="Add item"><PlusIcon /></Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Inputs</CardTitle>
                            <CardDescription>Inputs inherit the console-style mono treatment.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Input type="text" placeholder="article.slug" />
                            <Input type="email" placeholder="author@lab.dev" />
                            <Input disabled placeholder="readonly://locked" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status Surfaces</CardTitle>
                            <CardDescription>Small blocks for metadata, filters, and article annotations.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            <TerminalPill tone="neutral">draft</TerminalPill>
                            <TerminalPill tone="cyan">published</TerminalPill>
                            <TerminalPill tone="amber">experiment</TerminalPill>
                            <TerminalPill tone="rose">attention</TerminalPill>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <span className="terminal-label">micro interaction</span>
                            <div className="flex gap-2">
                                <ActionIconButton tone="quiet"><PlusIcon /></ActionIconButton>
                                <ActionIconButton tone="surface"><PlusIcon /></ActionIconButton>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <GeekPanel eyebrow="article blocks" title="Reading Experience">
                    <div className="space-y-5">
                        <p className="text-sm leading-7 text-muted-foreground">
                            The article system should feel like a research notebook rather than a generic blog theme.
                            That means strong section dividers, code windows, metadata strips, and callouts with explicit tone.
                        </p>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="border border-border/70 bg-background/70 p-4">
                                <div className="terminal-label">planned</div>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">CalloutBlock, PromptCard, SpecTable, FigureFrame.</p>
                            </div>
                            <div className="border border-border/70 bg-background/70 p-4">
                                <div className="terminal-label">next</div>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">Wire these surfaces into article pages and MDX content rendering.</p>
                            </div>
                        </div>
                    </div>
                </GeekPanel>
                <GeekPanel eyebrow="navigation frame" title="Component Library Direction">
                    <div className="grid gap-3">
                        {[
                            "Foundation: tokens, buttons, inputs, panels, pills",
                            "Shell: nav, section frame, command surfaces, sticky toc",
                            "Content: callouts, code windows, article meta, figures",
                            "Interactive: expandable specs, diff blocks, copy actions",
                        ].map((item, index) => (
                            <div key={item} className="flex gap-3 border border-border/70 bg-background/70 px-4 py-3">
                                <span className="terminal-label text-primary">0{index + 1}</span>
                                <span className="text-sm leading-7 text-muted-foreground">{item}</span>
                            </div>
                        ))}
                    </div>
                </GeekPanel>
            </section>
        </div>
    )
}

export default DesignSystemPage
