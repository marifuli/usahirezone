import {
  collection,
  getDocs,
  limit,
  query,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { slugify } from "@/lib/helpers/slug";
import type { EmploymentType } from "@/types";

const COMPANIES = [
  { name: "Google", logo: "https://unavatar.io/google.com", industry: "Technology", headquarters: "Mountain View, CA", website: "https://careers.google.com" },
  { name: "Microsoft", logo: "https://unavatar.io/microsoft.com", industry: "Technology", headquarters: "Redmond, WA", website: "https://careers.microsoft.com" },
  { name: "Apple", logo: "https://unavatar.io/apple.com", industry: "Technology", headquarters: "Cupertino, CA", website: "https://apple.com/jobs" },
  { name: "Amazon", logo: "https://unavatar.io/amazon.com", industry: "E-Commerce / Cloud", headquarters: "Seattle, WA", website: "https://amazon.jobs" },
  { name: "Meta", logo: "https://unavatar.io/meta.com", industry: "Social Media", headquarters: "Menlo Park, CA", website: "https://metacareers.com" },
  { name: "Stripe", logo: "https://unavatar.io/stripe.com", industry: "Fintech", headquarters: "San Francisco, CA", website: "https://stripe.com/jobs" },
  { name: "Netflix", logo: "https://unavatar.io/netflix.com", industry: "Entertainment", headquarters: "Los Gatos, CA", website: "https://jobs.netflix.com" },
  { name: "Tesla", logo: "https://unavatar.io/tesla.com", industry: "Automotive / Energy", headquarters: "Austin, TX", website: "https://tesla.com/careers" },
  { name: "Salesforce", logo: "https://unavatar.io/salesforce.com", industry: "Software", headquarters: "San Francisco, CA", website: "https://salesforce.com/careers" },
  { name: "Airbnb", logo: "https://unavatar.io/airbnb.com", industry: "Travel", headquarters: "San Francisco, CA", website: "https://careers.airbnb.com" },
  { name: "Uber", logo: "https://unavatar.io/uber.com", industry: "Transportation", headquarters: "San Francisco, CA", website: "https://uber.com/careers" },
  { name: "Adobe", logo: "https://unavatar.io/adobe.com", industry: "Software", headquarters: "San Jose, CA", website: "https://adobe.com/careers" },
];

const LOCATIONS = [
  { city: "San Francisco", state: "California", abbr: "CA" },
  { city: "New York", state: "New York", abbr: "NY" },
  { city: "Austin", state: "Texas", abbr: "TX" },
  { city: "Seattle", state: "Washington", abbr: "WA" },
  { city: "Chicago", state: "Illinois", abbr: "IL" },
  { city: "Boston", state: "Massachusetts", abbr: "MA" },
  { city: "Denver", state: "Colorado", abbr: "CO" },
  { city: "Los Angeles", state: "California", abbr: "CA" },
  { city: "Atlanta", state: "Georgia", abbr: "GA" },
  { city: "Miami", state: "Florida", abbr: "FL" },
];

const TITLES = [
  { title: "Senior Software Engineer", category: "Software Engineering", skills: ["React", "TypeScript", "Node.js", "AWS"] },
  { title: "Frontend Developer", category: "Software Engineering", skills: ["Next.js", "Tailwind CSS", "GraphQL"] },
  { title: "Backend Engineer", category: "Software Engineering", skills: ["Go", "Python", "PostgreSQL", "Docker"] },
  { title: "Full Stack Engineer", category: "Software Engineering", skills: ["React", "Node.js", "MongoDB", "TypeScript"] },
  { title: "DevOps Specialist", category: "Software Engineering", skills: ["Kubernetes", "Terraform", "CI/CD", "AWS"] },
  { title: "Data Scientist", category: "Data Science", skills: ["Python", "PyTorch", "SQL", "Machine Learning"] },
  { title: "Data Engineer", category: "Data Science", skills: ["Spark", "Snowflake", "Python", "Airflow"] },
  { title: "Product Manager", category: "Product Management", skills: ["Agile", "User Research", "Roadmapping", "SQL"] },
  { title: "UX/UI Designer", category: "Design", skills: ["Figma", "Design Systems", "Prototyping", "User Testing"] },
  { title: "Marketing Director", category: "Marketing", skills: ["SEO", "Content Strategy", "Google Analytics", "Growth"] },
];

const EMPLOYMENT_TYPES: EmploymentType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];

export async function seedJobsIfEmpty(force = false) {
  try {
    const jobsRef = collection(db, "jobs");
    const snapshot = await getDocs(query(jobsRef, limit(1)));
    if (!snapshot.empty && !force) {
      return false; // Already seeded
    }

    console.log("Seeding 100 USA jobs into Firestore...");
    const batch = writeBatch(db);

    // Seed Companies
    for (const comp of COMPANIES) {
      const compId = slugify(comp.name);
      const compRef = doc(db, "companies", compId);
      batch.set(compRef, {
        id: compId,
        slug: compId,
        name: comp.name,
        logo: comp.logo,
        industry: comp.industry,
        headquarters: comp.headquarters,
        website: comp.website,
        active: true,
      });
    }

    // Seed 100 Jobs
    for (let i = 1; i <= 100; i++) {
      const comp = COMPANIES[i % COMPANIES.length];
      const loc = LOCATIONS[i % LOCATIONS.length];
      const role = TITLES[i % TITLES.length];
      const empType = EMPLOYMENT_TYPES[i % EMPLOYMENT_TYPES.length];
      const isRemote = i % 2 === 0;
      const isVisa = i % 3 === 0;
      const compId = slugify(comp.name);

      const title = i > 10 ? `${role.title} (${role.category.split(" ")[0]} Team #${i})` : role.title;
      const rawSlug = slugify(`${title} ${comp.name} ${loc.city} ${i}`);

      const salaryMin = 80000 + (i % 10) * 10000;
      const salaryMax = salaryMin + 30000 + (i % 5) * 5000;

      const jobData = {
        id: rawSlug,
        title,
        slug: rawSlug,
        companyId: compId,
        companyName: comp.name,
        companyLogo: comp.logo,
        description: `We are looking for an experienced ${role.title} to join our team at ${comp.name}. You will be working on cutting-edge features that scale to millions of US users. Key responsibilities include designing scalable systems, collaborating with cross-functional teams, and maintaining high code quality.`,
        requirements: [
          `3+ years of experience in ${role.category}`,
          `Strong proficiency in ${role.skills.slice(0, 2).join(" and ")}`,
          "Excellent communication and problem-solving skills",
          "BS or MS in Computer Science, or equivalent experience",
        ],
        benefits: [
          "Competitive salary and equity package",
          "Comprehensive health, dental, and vision insurance",
          "401(k) matching up to 6%",
          "Flexible PTO and remote work options",
          "Annual learning and wellness stipend",
        ],
        salaryMin: empType === "INTERNSHIP" ? 40000 : salaryMin,
        salaryMax: empType === "INTERNSHIP" ? 70000 : salaryMax,
        currency: "USD",
        employmentType: empType,
        experience: i % 2 === 0 ? "MID_LEVEL" : "SENIOR",
        visaSponsorship: isVisa,
        remote: isRemote,
        remoteStatus: isRemote ? "REMOTE" : "ON_SITE",
        city: loc.city,
        state: loc.state,
        country: "USA",
        skills: role.skills,
        category: slugify(role.category),
        postedAt: new Date(Date.now() - (i * 12 * 3600 * 1000)),
        source: comp.name,
        sourceUrl: comp.website,
        featured: i <= 10,
        active: true,
      };

      const jobRef = doc(db, "jobs", rawSlug);
      batch.set(jobRef, jobData);
    }

    await batch.commit();
    console.log("Successfully seeded 100 jobs and top USA companies!");
    return true;
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    return false;
  }
}