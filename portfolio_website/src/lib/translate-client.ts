/**
 * Client-side EN→AR translation using MyMemory (free, no key).
 * Automatically splits text into ≤480-char chunks at natural boundaries
 * (newlines → sentences → chars) to stay within the API's 500-char limit.
 */

const MAX = 480;

function buildChunks(text: string): string[] {
  const lines  = text.split('\n');
  const chunks: string[] = [];
  let buf = '';

  for (const line of lines) {
    const candidate = buf.length > 0 ? `${buf}\n${line}` : line;

    if (candidate.length <= MAX) {
      buf = candidate;
    } else {
      if (buf) chunks.push(buf);

      if (line.length <= MAX) {
        buf = line;
      } else {
        // Split at sentence boundaries
        const sentences = line.split(/(?<=[.!?])\s+/);
        let sbuf = '';
        for (const sent of sentences) {
          const sc = sbuf ? `${sbuf} ${sent}` : sent;
          if (sc.length <= MAX) {
            sbuf = sc;
          } else {
            if (sbuf) chunks.push(sbuf);
            if (sent.length <= MAX) {
              sbuf = sent;
            } else {
              // Force-split at MAX chars
              for (let i = 0; i < sent.length; i += MAX) {
                chunks.push(sent.slice(i, i + MAX));
              }
              sbuf = '';
            }
          }
        }
        if (sbuf) chunks.push(sbuf);
        buf = '';
      }
    }
  }
  if (buf) chunks.push(buf);
  return chunks.filter(Boolean);
}

async function fetchTranslation(text: string): Promise<string> {
  if (!text.trim()) return text;
  const url  = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`;
  const res  = await fetch(url);
  const data = await res.json();
  if (data.responseStatus === 403 || String(data.responseDetails ?? '').includes('LIMIT')) {
    throw new Error('Translation quota reached — try again later.');
  }
  return data.responseData?.translatedText ?? text;
}

export async function translateToArabic(text: string): Promise<string> {
  if (!text.trim()) return '';
  if (text.length <= MAX) return fetchTranslation(text);

  const chunks  = buildChunks(text);
  const results: string[] = [];
  for (const chunk of chunks) {
    results.push(await fetchTranslation(chunk));
    // Brief pause between requests to avoid rate-limiting
    if (chunks.length > 1) await new Promise(r => setTimeout(r, 150));
  }
  return results.join('\n');
}
