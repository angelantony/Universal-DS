const ALLOWED_ELEMENTS = new Set([
  'svg',
  'g',
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
  'defs',
  'clippath',
  'title',
]);

const ALLOWED_ATTRIBUTES = new Set([
  'viewbox',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'd',
  'cx',
  'cy',
  'r',
  'x',
  'y',
  'rx',
  'ry',
  'width',
  'height',
  'points',
  'transform',
  'clip-path',
  'id',
  'xmlns',
]);

async function purify(svg: string): Promise<string> {
  const { default: DOMPurify } = await import('dompurify');
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true },
    FORBID_TAGS: ['foreignObject', 'script', 'style', 'iframe'],
    FORBID_ATTR: ['href', 'xlink:href'],
  });
}

function allowlist(svg: string): string {
  const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const root = parsed.querySelector('svg');
  if (!root || parsed.querySelector('parsererror')) return '';

  const clean = (element: Element): void => {
    if (!ALLOWED_ELEMENTS.has(element.tagName.toLowerCase())) {
      element.remove();
      return;
    }
    for (const attribute of [...element.attributes]) {
      const name = attribute.name.toLowerCase();
      if (
        name.startsWith('on') ||
        name === 'href' ||
        name.endsWith(':href') ||
        !ALLOWED_ATTRIBUTES.has(name)
      ) {
        element.removeAttribute(attribute.name);
      }
    }
    for (const paint of ['fill', 'stroke'] as const) {
      const value = element.getAttribute(paint);
      if (value !== null && value !== 'none') element.setAttribute(paint, 'currentColor');
    }
    for (const child of [...element.children]) clean(child);
  };

  clean(root);
  if (!root.hasAttribute('fill')) root.setAttribute('fill', 'currentColor');
  return root.outerHTML;
}

/** Sanitizes an untrusted SVG string. Returns an empty string when nothing safe remains. */
export async function sanitizeSvg(svg: string): Promise<string> {
  if (typeof DOMParser === 'undefined') {
    throw new Error(
      'sanitizeSvg requires a DOM parser and cannot run while importing on the server.',
    );
  }
  return allowlist(await purify(svg));
}
