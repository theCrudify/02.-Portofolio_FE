import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { ThemeToggle } from '@/components/layout/theme-toggle';

describe('admin theme toggle', () => {
  it('switches the html class between light and dark inside the admin provider', async () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia;

    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    await act(async () => fireEvent.click(button));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    await act(async () => fireEvent.click(button));
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});
