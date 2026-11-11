export interface Viewport {
  readonly name: string;
  readonly width: number;
  readonly height: number;
}

/** Minimum viewport set every responsive test must cover (docs/architecture/testing-strategy.md). */
export const STANDARD_VIEWPORTS = [
  { name: 'mobile-s', width: 320, height: 568 },
  { name: 'mobile-m', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'desktop-hd', width: 1920, height: 1080 },
] as const satisfies readonly Viewport[];

export type StandardViewportName = (typeof STANDARD_VIEWPORTS)[number]['name'];
