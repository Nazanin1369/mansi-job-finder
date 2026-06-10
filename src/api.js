import { SYSTEM_PROMPT } from './constants';

export async function fetchJobs({ tier, level, activeDomains, keyword }) {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('REACT_APP_ANTHROPIC_API_KEY is not set. Add it to your .env file.');

  const userMsg = `Find job openings for Mansi Shah.
Company tier: ${tier}
Level: ${level}
Domain focus: ${[...activeDomains].join(', ')}
${keyword ? 'Additional keyword: ' + keyword : ''}
Generate realistic mid-2026 openings.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMsg }],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  let text = (data.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  text = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m =>
    m.replace(/```json\n?|```\n?/g, '')
  ).trim();

  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('No job data returned. Try again.');

  return JSON.parse(text.slice(start, end + 1));
}
