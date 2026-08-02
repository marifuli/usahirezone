import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants";
import { getActiveJobs } from "@/lib/firestore/jobs";
import { getCompanies } from "@/lib/firestore/companies";
import { getCategories } from "@/lib/firestore/categories";
import { getStates } from "@/lib/firestore/states";
import { getCities } from "@/lib/firestore/cities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/jobs`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/latest-jobs`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/remote-jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/visa-sponsored-jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/internships`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/companies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/states`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/cities`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/salary-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/career-resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const [jobs, companies, categories, states, cities] = await Promise.all([
      getActiveJobs({}, 100),
      getCompanies(100),
      getCategories(100),
      getStates(60),
      getCities(200),
    ]);

    const jobUrls: MetadataRoute.Sitemap = jobs.items.map((job) => ({
      url: `${SITE_URL}/jobs/${job.slug}`,
      lastModified: job.postedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const companyUrls: MetadataRoute.Sitemap = companies.map((c) => ({
      url: `${SITE_URL}/company/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const stateUrls: MetadataRoute.Sitemap = states.map((s) => ({
      url: `${SITE_URL}/state/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    const cityUrls: MetadataRoute.Sitemap = cities.map((c) => ({
      url: `${SITE_URL}/city/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...jobUrls,
      ...companyUrls,
      ...categoryUrls,
      ...stateUrls,
      ...cityUrls,
    ];
  } catch {
    return staticRoutes;
  }
}