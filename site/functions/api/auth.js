// Cloudflare Pages Function：Decap CMS 後台的 GitHub 登入 — 第 1 步（導向 GitHub 授權）
// 環境變數：GITHUB_CLIENT_ID（在 Cloudflare Pages 專案設定裡）
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${url.origin}/api/callback`,
    scope: "repo,user",
  });
  return Response.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`, 302);
}
