import { describe, expect, it } from 'vitest';
import { legacy } from './legacy';

const STUB = '<script>\n  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n</script>\n';
const LOADER = '<script defer src="/_vercel/insights/script.js"></script>\n';

/** Minimal page shaped like legacy/index.html; `head`/`body` override parts of it. */
function page({
  head = `<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width">\n<title>A &amp; B</title>\n<style>p{}</style>\n${STUB}${LOADER}`,
  body = '<p>Hello</p>',
}: { head?: string; body?: string } = {}): string {
  return `<!DOCTYPE html>\n<html>\n<head>\n${head}</head>\n<body>${body}</body>\n</html>\n`;
}

describe('legacy()', () => {
  it('splits the real legacy/index.html and strips the analytics snippet', () => {
    const { title, headInner, bodyInner } = legacy();
    expect(title).toContain('Sneha Islam');
    expect(title).not.toMatch(/&amp;|&lt;|&gt;/);
    expect(headInner).toContain('<style>');
    expect(headInner).not.toMatch(/<title>|<meta charset|name="viewport"/);
    expect(bodyInner).toContain('<script>');
    expect(headInner + bodyInner).not.toMatch(/window\.va|_vercel\/insights/);
  });

  it('decodes entities in the title of synthetic input', () => {
    const { title, headInner, bodyInner } = legacy(page());
    expect(title).toBe('A & B');
    expect(headInner.trim()).toBe('<style>p{}</style>');
    expect(bodyInner).toBe('<p>Hello</p>');
  });

  it('throws when <body> is missing', () => {
    expect(() => legacy(page().replace('<body>', '<main>'))).toThrow('missing marker "<body>"');
  });

  it('throws when </head> is missing', () => {
    expect(() => legacy(page().replace('</head>', ''))).toThrow('missing marker "</head>"');
  });

  it('throws when the analytics stub is absent', () => {
    expect(() => legacy(page({ head: `<meta charset="UTF-8">\n<meta name="viewport" content="x">\n<title>T</title>\n${LOADER}` }))).toThrow(
      'expected exactly one Vercel window.va stub <script> in <head>, found 0',
    );
  });

  it('throws when the insights loader is absent', () => {
    expect(() => legacy(page({ head: `<meta charset="UTF-8">\n<meta name="viewport" content="x">\n<title>T</title>\n${STUB}` }))).toThrow(
      'expected exactly one Vercel insights <script> loader in <head>, found 0',
    );
  });

  it('throws when the analytics snippet appears twice', () => {
    expect(() =>
      legacy(page({ head: `<meta charset="UTF-8">\n<meta name="viewport" content="x">\n<title>T</title>\n${STUB}${LOADER}${STUB}${LOADER}` })),
    ).toThrow('expected exactly one Vercel window.va stub <script> in <head>, found 2');
  });

  it('throws when a window.va reference remains after stripping', () => {
    expect(() => legacy(page({ body: '<p>Hi</p><script>window.va("event")</script>' }))).toThrow(
      'a hand-written Vercel analytics snippet remains after stripping',
    );
  });
});
