import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../site.config";

// RSS feed：Buttondown 可訂閱此 feed 自動產生電子報草稿，經你確認後才寄出
export async function GET(context) {
  const posts = (await getCollection("thoughts", ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? "",
      link: `/thoughts/${post.id}/`,
    })),
  });
}
