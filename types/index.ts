import type { QueryDocumentSnapshot } from "firebase/firestore";

// ============ ENUMS ============

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "TEMPORARY"
  | "FREELANCE";

export type RemoteStatus = "ON_SITE" | "REMOTE" | "HYBRID";

export type ApplicationStatus =
  | "SUBMITTED"
  | "REVIEWING"
  | "INTERVIEW"
  | "OFFERED"
  | "REJECTED"
  | "WITHDRAWN";

export type QuestionType =
  | "TEXT"
  | "TEXTAREA"
  | "RADIO"
  | "CHECKBOX"
  | "DROPDOWN"
  | "NUMBER"
  | "DATE"
  | "FILE";

// ============ JOB ============

export interface Job {
  id: string;
  title: string;
  slug: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  employmentType: EmploymentType;
  experience?: string;
  visaSponsorship: boolean;
  remote: boolean;
  remoteStatus?: RemoteStatus;
  city: string;
  state: string;
  country: string;
  skills: string[];
  category: string;
  postedAt: Date;
  expiresAt?: Date;
  source: string;
  sourceUrl?: string;
  questionnaireId?: string;
  featured: boolean;
  active: boolean;
}

export interface JobFilters {
  category?: string;
  state?: string;
  city?: string;
  remote?: boolean;
  visaSponsorship?: boolean;
  employmentType?: EmploymentType;
  companyId?: string;
  salaryMin?: number;
  experience?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  lastVisible?: QueryDocumentSnapshot;
  hasMore: boolean;
  page: number;
  pageSize: number;
}

// ============ COMPANY ============

export interface Company {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  website?: string;
  industry?: string;
  description?: string;
  headquarters?: string;
  foundedYear?: number;
  size?: string;
  active: boolean;
}

// ============ CATEGORY ============

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  active: boolean;
}

// ============ STATE / CITY ============

export interface State {
  id: string;
  slug: string;
  name: string;
  abbreviation: string;
  description?: string;
  averageSalary?: number;
  active: boolean;
}

export interface City {
  id: string;
  slug: string;
  name: string;
  state: string;
  stateAbbreviation: string;
  description?: string;
  averageSalary?: number;
  active: boolean;
}

// ============ QUESTIONNAIRE ============

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  options?: QuestionOption[];
  placeholder?: string;
  helpText?: string;
}

export interface Questionnaire {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  active: boolean;
}

// ============ APPLICATION ============

export interface ApplicationAnswer {
  questionId: string;
  value: string | string[] | number | boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  companyName: string;
  userId?: string;
  applicantName?: string;
  applicantEmail?: string;
  resumeUrl?: string;
  coverLetter?: string;
  answers: ApplicationAnswer[];
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============ USER ============

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  location?: string;
  headline?: string;
  resumeUrl?: string;
  documents?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ============ SAVED JOB ============

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  companyName: string;
  savedAt: Date;
}

// ============ SEARCH ============

export interface SearchParams {
  q?: string;
  company?: string;
  city?: string;
  state?: string;
  remote?: string;
  visa?: string;
  employmentType?: string;
  salaryMin?: string;
  experience?: string;
  category?: string;
  page?: string;
}