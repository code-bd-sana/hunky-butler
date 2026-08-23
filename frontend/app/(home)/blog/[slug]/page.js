import { base_url } from "@/utils/utils";
import BlogDetailsClient from "./BlogDetailsClient";

const SITE_URL = "https://www.hunkybutlerservice.co.uk";

/**
 * Article pages previously had no metadata of their own. They inherited
 * app/(home)/blog/layout.js wholesale, which meant every post:
 *
 *   - served the generic title "Hen Party Ideas & Tips Blog"
 *   - declared <link rel="canonical" href=".../blog">
 *
 * That canonical told Google each article was a duplicate of the listing page,
 * so no post could ever be indexed on its own. This server component fetches
 * the post and supplies a real per-article title, description and self
 * referencing canonical, which override the inherited layout metadata.
 *
 * The interactive part stays in BlogDetailsClient.
 */

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function getPost(slug) {
  try {
    const res = await fetch(`${base_url}/blogs/${slug}`, {
      // Posts change rarely. Revalidate hourly rather than on every request.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    // Metadata generation must never break the page render.
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const url = `${SITE_URL}/blog/${slug}`;

  if (!post?.title) {
    return {
      title: "Hen Party Ideas & Tips Blog | Hunky Butler Service",
      alternates: { canonical: url },
    };
  }

  const title = `${post.title} | Hunky Butler Service`;
  const description =
    stripHtml(post.content).slice(0, 155).trim() ||
    "Hen party inspiration, planning tips and entertainment ideas from Hunky Butler Service.";
  const image = post.thumbnailUrl || `${SITE_URL}/logo.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Hunky Butler Service",
      type: "article",
      publishedTime: post.date || post.createdAt,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  // BlogArticle schema so the post is understood as an article rather than an
  // untyped page. Rendered only when the post actually resolved.
  const articleJsonLd = post?.title
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: stripHtml(post.content).slice(0, 200),
        image: post.thumbnailUrl || `${SITE_URL}/logo.png`,
        datePublished: post.date || post.createdAt,
        dateModified: post.updatedAt || post.date || post.createdAt,
        mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
        author: {
          "@type": "Organization",
          name: "Hunky Butler Service",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Hunky Butler Service",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
        },
      }
    : null;

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <BlogDetailsClient />
    </>
  );
}
