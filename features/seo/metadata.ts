import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/constants";

interface SEOOptions {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  image,
  publishedTime,
  modifiedTime,
  noindex = false,
}: SEOOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: image ? [{ url: image }] : undefined,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: image ? [image] : undefined,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildHomeMetadata(): Metadata {
  return buildMetadata({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: "/",
  });
}