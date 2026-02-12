"use client"
import React from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/app/components/ui/card'

const DesignSystemPage = () => {
    return (
        <div className="container p-10 space-y-8">
            <h1 className="text-3xl font-bold">Design System & Component Showcase</h1>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-background border rounded">Background</div>
                    <div className="p-4 bg-foreground text-background border rounded">Foreground</div>
                    <div className="p-4 bg-primary text-primary-foreground rounded">Primary</div>
                    <div className="p-4 bg-secondary text-secondary-foreground rounded">Secondary</div>
                    <div className="p-4 bg-muted text-muted-foreground rounded">Muted</div>
                    <div className="p-4 bg-accent text-accent-foreground rounded">Accent</div>
                    <div className="p-4 bg-destructive text-destructive-foreground rounded">Destructive</div>
                    <div className="p-4 bg-card text-card-foreground border rounded">Card</div>
                    <div className="p-4 bg-popover text-popover-foreground border rounded">Popover</div>
                    <div className="p-4 bg-input border rounded">Input Border</div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Buttons</h2>
                <div className="flex gap-4 flex-wrap">
                    <Button>Default Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="link">Link Button</Button>
                    <Button size="sm">Small</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">Icon</Button>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Inputs</h2>
                <div className="grid max-w-sm gap-4">
                    <Input type="email" placeholder="Email" />
                    <Input type="password" placeholder="Password" />
                    <Input disabled placeholder="Disabled" />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content here. This uses the card background color.</p>
                        </CardContent>
                        <CardFooter>
                            <Button>Action</Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>
        </div>
    )
}

export default DesignSystemPage
