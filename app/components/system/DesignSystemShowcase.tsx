"use client"

import React from "react"
import {
  ArrowRightIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons"
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import {
  ActionIconButton,
  FormMessage,
  SectionHeading,
  StatusMessage,
  SurfaceCard,
} from "@/app/components/system"

function DesignSystemShowcase() {
  return (
    <div className="container space-y-10 px-4 py-10 sm:px-6">
      <SectionHeading
        align="left"
        title="Design System & Component Showcase"
        description="Shared tokens, primitives, and normalized site-level patterns used across the portfolio."
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Colors</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded border bg-background p-4">Background</div>
          <div className="rounded border bg-foreground p-4 text-background">Foreground</div>
          <div className="rounded bg-primary p-4 text-primary-foreground">Primary</div>
          <div className="rounded bg-secondary p-4 text-secondary-foreground">Secondary</div>
          <div className="rounded bg-muted p-4 text-muted-foreground">Muted</div>
          <div className="rounded bg-accent p-4 text-accent-foreground">Accent</div>
          <div className="rounded bg-destructive p-4 text-destructive-foreground">
            Destructive
          </div>
          <div className="rounded border bg-card p-4 text-card-foreground">Card</div>
          <div className="rounded border bg-popover p-4 text-popover-foreground">Popover</div>
          <div className="rounded border bg-input p-4">Input Border</div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="subtle">Subtle Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <ActionIconButton aria-label="Code">
            <CodeBracketIcon className="h-5 w-5" />
          </ActionIconButton>
          <ActionIconButton aria-label="Preview">
            <EyeIcon className="h-5 w-5" />
          </ActionIconButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Inputs</h2>
        <div className="grid max-w-sm gap-4">
          <Input type="email" placeholder="Email" />
          <Input type="email" state="error" placeholder="Invalid email" />
          <Input disabled placeholder="Disabled" />
          <Textarea placeholder="Message" />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Shared normalization components"
          description="These are the shared patterns we can reuse while normalizing layout, surfaces, and feedback states."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <SurfaceCard className="space-y-4" interactive>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Surface card</p>
                <h3 className="text-lg font-semibold">Reusable shell</h3>
              </div>
              <ActionIconButton type="button" aria-label="Continue" active>
                <ArrowRightIcon className="h-4 w-4" />
              </ActionIconButton>
            </div>
            <FormMessage tone="quiet">Use this for inline guidance, helper text, and low-emphasis copy.</FormMessage>
          </SurfaceCard>

          <div className="space-y-4">
            <StatusMessage title="Normalization guidance" tone="info">
              Keep style changes minimal, token-driven, and free of business logic changes.
            </StatusMessage>
            <StatusMessage title="Migration caution" tone="warning">
              Split structural changes from visual refinements so we can verify each step cleanly.
            </StatusMessage>
            <StatusMessage title="Validation complete" tone="success">
              The shared surface layer is ready for broader page-level adoption.
            </StatusMessage>
            <StatusMessage title="Action required" tone="error">
              Avoid introducing new one-off token names or hard-coded colors.
            </StatusMessage>
            <div className="flex flex-wrap gap-3">
              <ActionIconButton type="button" aria-label="Information">
                <InfoCircledIcon className="h-4 w-4" />
              </ActionIconButton>
              <ActionIconButton type="button" aria-label="Success" active>
                <CheckCircledIcon className="h-4 w-4" />
              </ActionIconButton>
              <ActionIconButton type="button" aria-label="Warning">
                <ExclamationTriangleIcon className="h-4 w-4" />
              </ActionIconButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DesignSystemShowcase
