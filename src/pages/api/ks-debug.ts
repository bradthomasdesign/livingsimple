export const prerender = false;

import type { APIRoute } from 'astro';

// Step 1: Visit /api/ks-debug to get the GitHub OAuth URL
// Step 2: Authorize on GitHub — it redirects back here with ?code=xxx
// Step 3: We show you the raw token response from GitHub
export const GET: APIRoute = async ({ url, redirect }) => {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
  const code = url.searchParams.get('code');

  // No code yet — redirect to GitHub OAuth
  if (!code) {
    const ghUrl = new URL('https://github.com/login/oauth/authorize');
    ghUrl.searchParams.set('client_id', clientId ?? '');
    ghUrl.searchParams.set('redirect_uri', `${url.origin}/api/ks-debug`);
    return redirect(ghUrl.toString());
  }

  // Got code back from GitHub — exchange it
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
    tokenUrl.searchParams.set('redirect_uri', `${url.origin}/api/ks-debug`);

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' }
    });

    result.githubStatus = res.status;
    result.githubOk = res.ok;
    const body = await res.json();
    // Mask tokens but show all field names
    result.githubResponseFields = Object.keys(body);
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
