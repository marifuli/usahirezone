import { SITE_NAME, SITE_URL } from "@/constants";
import type { Job, Company } from "@/types";

export function jobPostingSchema(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    ...(job.expiresAt && { validThrough: job.expiresAt }),
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      ...(job.companyLogo && { logo: job.companyLogo }),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city,
        addressRegion: job.state,
        addressCountry: job.country,
      },
    },
    ...(job.remote && { jobLocationType: "TELECOMMUTE" }),
    ...(job.salaryMin &&
      job.salaryMax && {
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: job.currency,
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salaryMin,
            maxValue: job.salaryMax,
            unitText: "YEAR",
          },
        },
      }),
    ...(job.skills?.length && {
      skills: job.skills.join(", "),
    }),
    url: `${SITE_URL}/jobs/${job.slug}`,
  };
}

export function companySchema(company: Company) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    ...(company.logo && { logo: company.logo }),
    ...(company.website && { url: company.website }),
    ...(company.industry && { industry: company.industry }),
    ...(company.description && { description: company.description }),
    ...(company.headquarters && {
      address: {
        "@type": "PostalAddress",
        addressLocality: company.headquarters,
      },
    }),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "US job board aggregating opportunities across the United States.",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}