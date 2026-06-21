export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');
  if (!code) {
    return new Response(JSON.stringify({ error: 'No code provided. Usage: /api/ks-debug?code=YOUR_CODE' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

  const result: Record<string, unknown> = {
    clientIdPresent: !!clientId,
    clientIdPrefix: clientId ? clientId.slice(0, 4) : null,
    clientSecretPresent: !!clientSecret,
    clientSecretLength: clientSecret?.length ?? null,
  };

  try {
    const tokenUrl = new URL('https://github.com/login/oauth/access_token');
    tokenUrl.searchParams.set('client_id', clientId ?? '');
    tokenUrl.searchParams.set('client_secret', clientSecret ?? '');
    tokenUrl.searchParams.set('code', code);

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' }
    });

    result.githubStatus = res.status;
    result.githubOk = res.ok;
    const body = await res.json();
    // Mask token if present
    if (body.access_token) body.access_token = '[REDACTED]';
    if (body.refresh_token) body.refresh_token = '[REDACTED]';
    result.githubResponse = body;
  } catch (e: unknown) {
    result.fetchError = e instanceof Error ? e.message : String(e);
  }

  return new Response(JSON.stringify(result, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
