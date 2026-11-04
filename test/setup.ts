import { vi } from 'vitest';

vi.mock('next/font/google', () => {
  const createFontMock = (opts?: { variable?: string }) => ({
    className: 'mock-font',
    variable: opts?.variable ?? '--mock-font',
    style: { fontFamily: 'mock-font' },
  });
  return {
    Geist: createFontMock,
    Geist_Mono: createFontMock,
    Inter: createFontMock,
    JetBrains_Mono: createFontMock,
    Instrument_Serif: createFontMock,
  };
});
