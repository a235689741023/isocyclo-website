"""發文時自動在 Buttondown 建立信件草稿。

由 GitHub Actions 觸發：比對這次 push 新增/修改的「所思所想」文章，
略過草稿（draft: true）與已建立過草稿的文章（以信件主旨比對），
其餘逐篇呼叫 Buttondown API 建立 draft，由站長在 Buttondown 確認後寄出。
"""

import json
import os
import re
import sys
import urllib.request

API = "https://api.buttondown.com/v1"
SITE_URL = "https://isocyclo.com"
TOKEN = os.environ["BUTTONDOWN_API_KEY"]


def api(path, payload=None):
    req = urllib.request.Request(
        f"{API}{path}",
        data=json.dumps(payload).encode() if payload else None,
        headers={
            "Authorization": f"Token {TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST" if payload else "GET",
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())


def parse_frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.S)
    if not m:
        return {}, text
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip("\"'")
    return meta, m.group(2).strip()


def absolutize(md):
    """把相對路徑的圖片/連結轉成完整網址，信件裡才顯示得出來"""
    md = re.sub(r"\]\(/", f"]({SITE_URL}/", md)
    md = re.sub(r'src="/', f'src="{SITE_URL}/', md)
    return md


def existing_subjects():
    subjects = set()
    url = "/emails"
    data = api(url)
    for e in data.get("results", []):
        subjects.add(e.get("subject", ""))
    return subjects


def main(files):
    sent = existing_subjects()
    for path in files:
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as f:
            meta, body = parse_frontmatter(f.read())
        title = meta.get("title", "")
        if not title:
            continue
        if meta.get("draft", "false").lower() == "true":
            print(f"略過草稿：{title}")
            continue
        if title in sent:
            print(f"已有同名信件，略過：{title}")
            continue
        slug = os.path.splitext(os.path.basename(path))[0]
        link = f"{SITE_URL}/thoughts/{slug}/"
        email_body = f"{absolutize(body)}\n\n---\n\n[在網站閱讀這篇文章]({link})"
        api("/emails", {"subject": title, "body": email_body, "status": "draft"})
        print(f"已建立 Buttondown 草稿：{title}")


if __name__ == "__main__":
    main(sys.argv[1:])
