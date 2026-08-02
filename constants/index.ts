import type { EmploymentType, Question } from "@/types";

export const SITE_NAME = "USAHireZone";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://usahirezone.com";
export const SITE_DESCRIPTION =
  "Find thousands of jobs across the United States. Search by city, state, remote, visa sponsorship, and more. Your gateway to American employment opportunities.";

export const EMPLOYMENT_TYPES: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
  FREELANCE: "Freelance",
};

export const US_STATES: { name: string; abbreviation: string }[] = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" },
];

export const DEFAULT_VISA_QUESTIONS: Question[] = [
  {
    id: "authorized_to_work",
    type: "RADIO",
    label: "Are you authorized to work in the US?",
    required: true,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "require_sponsorship",
    type: "RADIO",
    label: "Will you require visa sponsorship?",
    required: true,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "current_visa",
    type: "DROPDOWN",
    label: "What is your current visa status?",
    required: false,
    options: [
      { label: "US Citizen", value: "citizen" },
      { label: "Green Card Holder", value: "green_card" },
      { label: "H-1B", value: "h1b" },
      { label: "F-1 OPT", value: "f1_opt" },
      { label: "F-1 CPT", value: "f1_cpt" },
      { label: "J-1", value: "j1" },
      { label: "L-1", value: "l1" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "opt_remaining_months",
    type: "NUMBER",
    label: "How many months of OPT remain?",
    required: false,
    placeholder: "e.g. 24",
  },
  {
    id: "can_relocate",
    type: "RADIO",
    label: "Are you willing to relocate?",
    required: true,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "need_relocation_assistance",
    type: "RADIO",
    label: "Do you need relocation assistance?",
    required: false,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
];

export const DEFAULT_QUESTIONNAIRE_ID = "default-visa-questionnaire";

export const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Remote Jobs", href: "/remote-jobs" },
  { label: "Visa Sponsored", href: "/visa-sponsored-jobs" },
  { label: "Internships", href: "/internships" },
  { label: "Companies", href: "/companies" },
  { label: "Salary Guide", href: "/salary-guide" },
];

export const FOOTER_LINKS = {
  jobs: [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Latest Jobs", href: "/latest-jobs" },
    { label: "Remote Jobs", href: "/remote-jobs" },
    { label: "Visa Sponsored", href: "/visa-sponsored-jobs" },
    { label: "Internships", href: "/internships" },
  ],
  resources: [
    { label: "Companies", href: "/companies" },
    { label: "Categories", href: "/categories" },
    { label: "States", href: "/states" },
    { label: "Cities", href: "/cities" },
    { label: "Salary Guide", href: "/salary-guide" },
    { label: "Career Resources", href: "/career-resources" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
};