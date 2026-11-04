'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Clock, Mail, MapPin, Send, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api, ApiError } from '@/lib/api/client';
import type { PublicProfile, SupportedLocale } from '@/lib/api/types';
import { PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().max(150).optional(),
  body: z.string().trim().min(10).max(5000),
  website: z.string().optional(), // honeypot
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export interface ContactSectionProps {
  profile: PublicProfile | null;
  locale: SupportedLocale;
  muted?: boolean;
}

export function ContactSection({ profile, locale, muted }: ContactSectionProps) {
  const t = useTranslations('sections.contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      body: '',
      website: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      await api('/contact', {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          locale,
          turnstileToken:
            process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
        }),
      });
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError && err.status === 429) {
        setErrorMessage(t('rateLimited'));
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to send message');
      }
    }
  };

  const contactVisual = PORTFOLIO_SHOWCASE_IMAGES[1] ?? PORTFOLIO_SHOWCASE_IMAGES[0]!;

  return (
    <Section
      id="contact"
      eyebrow={t('eyebrow')}
      title={t('title')}
      subtitle={t('subtitle')}
      muted={muted}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left 5 Columns: Visual Collaboration Hub & Direct Channels */}
        <div className="space-y-4 lg:col-span-5">
          <SpotlightCard className="overflow-hidden p-3">
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={contactVisual.url}
                alt={contactVisual.alt}
                fill
                sizes="(max-width: 768px) 100vw, 440px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <Badge variant="default">Direct Engineering Channel</Badge>
                <span className="font-mono text-xs text-foreground">SLA &lt; 24H</span>
              </div>
            </div>
          </SpotlightCard>

          {profile?.email ? (
            <SpotlightCard>
              <CardContent className="flex items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">DIRECT EMAIL</p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm font-bold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </SpotlightCard>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <SpotlightCard className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>TIMEZONE</span>
              </div>
              <p className="mt-1 font-mono text-sm font-bold text-foreground">
                {profile?.timezone ?? 'Asia/Jakarta'}
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>LOCATION</span>
              </div>
              <p className="mt-1 font-mono text-sm font-bold text-foreground">
                {profile?.location ?? 'Jakarta, ID'}
              </p>
            </SpotlightCard>
          </div>

          {profile?.socials && Object.keys(profile.socials).length > 0 ? (
            <SpotlightCard>
              <CardContent className="space-y-2.5 p-5">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Verified Profiles &amp; Repositories
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {Object.entries(profile.socials).map(([key, url]) =>
                    url ? (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold capitalize text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span>{key}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : null,
                  )}
                </div>
              </CardContent>
            </SpotlightCard>
          ) : null}
        </div>

        {/* Right 7 Columns: Encrypted Dispatch Form */}
        <SpotlightCard className="lg:col-span-7">
          <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-6 py-3.5">
            <span className="font-mono text-xs font-semibold text-foreground">
              DISPATCH // DIRECT_INQUIRY
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-success">
              <ShieldCheck className="h-4 w-4" />
              <span>TURNSTILE PROTECTED</span>
            </span>
          </div>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Honeypot field */}
              <div aria-hidden="true" className="hidden">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('website')}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name">{t('name')}</Label>
                  <Input id="contact-name" {...register('name')} />
                  {errors.name ? (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email">{t('email')}</Label>
                  <Input id="contact-email" type="email" {...register('email')} />
                  {errors.email ? (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-subject">{t('subject')}</Label>
                <Input id="contact-subject" {...register('subject')} />
                {errors.subject ? (
                  <p className="text-xs text-destructive">{errors.subject.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-body">{t('message')}</Label>
                <Textarea id="contact-body" rows={5} {...register('body')} />
                {errors.body ? (
                  <p className="text-xs text-destructive">{errors.body.message}</p>
                ) : null}
              </div>

              {status === 'success' ? (
                <p role="status" className="text-sm font-medium text-success">
                  {t('success')}
                </p>
              ) : null}

              {status === 'error' && errorMessage ? (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {errorMessage}
                </p>
              ) : null}

              <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full sm:w-auto">
                <Send className="h-4 w-4" />
                <span>{status === 'loading' ? t('sending') : t('send')}</span>
              </Button>
            </form>
          </CardContent>
        </SpotlightCard>
      </div>
    </Section>
  );
}
