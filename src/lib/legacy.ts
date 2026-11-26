/**
 * Serves the frozen legacy page (`legacy/index.html`) from Astro without re-typing it.
 *
 * The file is read verbatim at build time. We split it into:
 *   - `title`     — the text inside its <title>
 *   - `headInner` — everything in <head> except charset/viewport/title (Base.astro owns those)
 *                   and the hand-written Vercel analytics snippet (replaced by <Analytics />, AD-13)
 *   - `bodyInner` — everything between <body> and </body>, unchanged
 *
 * Any missing marker throws, so the build fails loudly instead of shipping a broken page.
 * `legacy/index.html` itself is never edited.
 */
import legacyHtml from '../../legacy/index.html?raw';

const SOURCE = 'legacy/index.html';

export interface LegacyParts {
  title: string;
  headInner: string;
  bodyInner: string;
}

function between(html: string, open: string, close: string): string {
  const start = html.indexOf(open);
  if (start === -1) throw new Error(`${SOURCE}: missing marker "${open}"`);
  const end = html.indexOf(close, start + open.length);
  if (end === -1) throw new Error(`${SOURCE}: missing marker "${close}"`);
  return html.slice(start + open.length, end);
}

/** Remove exactly one match of `pattern`; throw if it is absent or appears more than once. */
function removeOnce(html: string, pattern: RegExp, what: string): string {
  const global = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
  const count = html.match(global)?.length ?? 0;
  if (count !== 1) {
    throw new Error(`${SOURCE}: expected exactly one ${what} in <head>, found ${count}`);
  }
  return html.replace(pattern, '');
}

export function legacy(html: string = legacyHtml): LegacyParts {
  const head = between(html, '<head>', '</head>');
  const bodyInner = between(html, '<body>', '</body>');

  const titleText = between(head, '<title>', '</title>');
  // Base.astro renders the title through Astro, which escapes text; decode the
  // entities used in the legacy title so it is not double-escaped.
  const title = titleText
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  let headInner = head;
  headInner = removeOnce(headInner, /[ \t]*<meta charset="[^"]*">\r?\n?/, '<meta charset> tag');
  headInner = removeOnce(headInner, /[ \t]*<meta name="viewport"[^>]*>\r?\n?/, '<meta name="viewport"> tag');
  headInner = removeOnce(headInner, /[ \t]*<title>[\s\S]*?<\/title>\r?\n?/, '<title> tag');
  // The hand-written Vercel snippet: the window.va stub and the insights loader.
  headInner = removeOnce(
    headInner,
    /[ \t]*<script>\s*window\.va = window\.va \|\|[\s\S]*?<\/script>\r?\n?/,
    'Vercel window.va stub <script>',
  );
  headInner = removeOnce(
    headInner,
    /[ \t]*<script defer src="\/_vercel\/insights\/script\.js"><\/script>\r?\n?/,
    'Vercel insights <script> loader',
  );

  if (/window\.va|_vercel\/insights/.test(headInner + bodyInner)) {
    throw new Error(`${SOURCE}: a hand-written Vercel analytics snippet remains after stripping`);
  }

  return { title, headInner, bodyInner };
}
