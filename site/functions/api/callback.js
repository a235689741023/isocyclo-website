// Cloudflare Pages Function：Decap CMS 後台的 GitHub 登入 — 第 2 步（用授權碼換 token，回傳給後台）
// 環境變數：GITHUB_CLIENT_ID、GITHUB_CLIENT_SECRET
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "decap-cms-oauth",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await tokenRes.json();

  const status = data.access_token ? "success" : "error";
  const payload = data.access_token
    ? { token: data.access_token, provider: "github" }
    : data;
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;

  // 標準 Decap CMS OAuth 握手：透過 postMessage 把 token 交回後台的 popup 視窗
  const html = `<!doctype html><html><body><script>
  (function() {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
  </script></body></html>`;

  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
}
