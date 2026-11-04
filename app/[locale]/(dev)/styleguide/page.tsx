import { notFound } from 'next/navigation';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function StyleguidePage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const presets = ['slate', 'forest', 'sunset', 'mono'] as const;

  return (
    <div className="space-y-4">
      <Section
        eyebrow="DESIGN SYSTEM"
        title="Portfolio Styleguide"
        subtitle="Typography, color tokens, theme presets, buttons, badges, inputs, and cards."
      >
        <div className="space-y-12">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">1. Typography Scale</h3>
            <div className="space-y-3 rounded-md border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                Eyebrow Section (12px · 600)
              </p>
              <h1 className="font-heading text-[40px] font-bold leading-tight md:text-[64px]">
                Hero Headline (40/64px)
              </h1>
              <h2 className="font-heading text-[28px] font-bold leading-tight md:text-[40px]">
                Section Heading H2 (28/40px)
              </h2>
              <h3 className="text-[18px] font-semibold md:text-[20px]">
                Card Heading H3 (18/20px)
              </h3>
              <p className="max-w-[65ch] text-base leading-[1.7] md:text-lg">
                Body text (16/18px · line-height 1.7 · max-width 65ch). Minimalist typography-first
                layout with generous whitespace and a single accent color.
              </p>
              <p className="text-sm text-muted-foreground">
                Meta / caption text (14px · muted-foreground)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">2. Theme Presets</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {presets.map((preset) => (
                <div
                  key={preset}
                  data-theme={preset}
                  className="rounded-md border border-border bg-card p-4 text-card-foreground"
                >
                  <p className="mb-3 font-mono text-xs uppercase text-muted-foreground">
                    data-theme=&quot;{preset}&quot;
                  </p>
                  <Button className="w-full capitalize">{preset} Primary</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">3. Buttons & Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="default">Default Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Published</Badge>
              <Badge variant="warning">Archived</Badge>
              <Badge variant="destructive">Expired</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle>Interactive Project Card</CardTitle>
                <CardDescription>Hover lifts 2px with subtle shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Uses CSS variable tokens exclusively without any hardcoded hex values.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  View Case Study
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Controls</CardTitle>
                <CardDescription>Accessible focus rings and labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sg-name">Full Name</Label>
                  <Input id="sg-name" placeholder="Enter your name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sg-bio">Short Bio</Label>
                  <Textarea id="sg-bio" placeholder="Write a message..." />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
