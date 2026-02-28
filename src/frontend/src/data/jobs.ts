import { JobType } from "../backend.d";

export interface JobListing {
  title: string;
  salaryCurrency: string;
  jobType: JobType;
  jobId: string;
  description: string;
  district: string;
  company: string;
  state: string;
  datePosted: bigint;
  salaryMax: bigint;
  salaryMin: bigint;
}

// Convert a JS Date to BigInt nanoseconds
function dateToNanos(date: Date): bigint {
  return BigInt(date.getTime()) * 1_000_000n;
}

const now = new Date();
const daysAgo = (d: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() - d);
  return dateToNanos(dt);
};

export const SAMPLE_JOBS: JobListing[] = [
  {
    jobId: "job-1",
    title: "Senior Software Engineer",
    company: "Axiata Digital",
    state: "Kuala Lumpur",
    district: "Bukit Bintang",
    jobType: JobType.fullTime,
    salaryMin: 8000n,
    salaryMax: 14000n,
    salaryCurrency: "MYR",
    description:
      "Join our dynamic engineering team to build next-generation digital products. You will design, develop, and maintain scalable backend services and APIs using Node.js and Go, working closely with product managers and UX designers.",
    datePosted: daysAgo(2),
  },
  {
    jobId: "job-2",
    title: "Full Stack Developer",
    company: "CIMB Bank Berhad",
    state: "Kuala Lumpur",
    district: "Damansara",
    jobType: JobType.fullTime,
    salaryMin: 6000n,
    salaryMax: 10000n,
    salaryCurrency: "MYR",
    description:
      "Build and maintain internal banking tools and customer-facing fintech solutions. Experience with React, TypeScript, and Java Spring Boot is essential. You will collaborate with cross-functional teams across Southeast Asia.",
    datePosted: daysAgo(4),
  },
  {
    jobId: "job-3",
    title: "Product Designer (UI/UX)",
    company: "Grab Malaysia",
    state: "Selangor",
    district: "Petaling Jaya",
    jobType: JobType.fullTime,
    salaryMin: 7000n,
    salaryMax: 11000n,
    salaryCurrency: "MYR",
    description:
      "Design intuitive and delightful experiences for Grab's super-app ecosystem. You will conduct user research, create wireframes, prototypes, and high-fidelity designs using Figma, and work with engineers to ship polished features.",
    datePosted: daysAgo(1),
  },
  {
    jobId: "job-4",
    title: "Registered Nurse (ICU)",
    company: "Pantai Hospital",
    state: "Selangor",
    district: "Klang",
    jobType: JobType.fullTime,
    salaryMin: 4000n,
    salaryMax: 6500n,
    salaryCurrency: "MYR",
    description:
      "Provide high-quality patient care in our Intensive Care Unit. Responsibilities include monitoring vital signs, administering medications, coordinating with physicians, and supporting patients and their families during critical periods.",
    datePosted: daysAgo(3),
  },
  {
    jobId: "job-5",
    title: "Data Analyst",
    company: "Maybank",
    state: "Kuala Lumpur",
    district: "KLCC",
    jobType: JobType.fullTime,
    salaryMin: 5500n,
    salaryMax: 8500n,
    salaryCurrency: "MYR",
    description:
      "Analyze complex datasets to provide actionable insights for retail banking strategies. You will build dashboards in Power BI, write SQL queries, and present findings to senior stakeholders to drive data-driven decisions.",
    datePosted: daysAgo(6),
  },
  {
    jobId: "job-6",
    title: "Frontend Developer (React)",
    company: "Shopee Malaysia",
    state: "Penang",
    district: "Georgetown",
    jobType: JobType.remote,
    salaryMin: 5000n,
    salaryMax: 9000n,
    salaryCurrency: "MYR",
    description:
      "Work remotely building high-performance e-commerce interfaces for Shopee's Malaysian platform. Proficiency in React, TypeScript, and performance optimization is required. Collaborate with teams in Singapore and Malaysia.",
    datePosted: daysAgo(7),
  },
  {
    jobId: "job-7",
    title: "Civil Engineer",
    company: "Gamuda Berhad",
    state: "Selangor",
    district: "Shah Alam",
    jobType: JobType.fullTime,
    salaryMin: 5000n,
    salaryMax: 8000n,
    salaryCurrency: "MYR",
    description:
      "Support the design and construction of major infrastructure projects including highways, tunnels, and LRT extensions. You will conduct site inspections, prepare technical reports, and liaise with contractors and government agencies.",
    datePosted: daysAgo(5),
  },
  {
    jobId: "job-8",
    title: "Primary School Teacher (Science)",
    company: "SK Convent Johor Bahru",
    state: "Johor",
    district: "Johor Bahru",
    jobType: JobType.fullTime,
    salaryMin: 3200n,
    salaryMax: 5000n,
    salaryCurrency: "MYR",
    description:
      "Teach Science to Years 4-6 students, creating engaging lesson plans aligned with the national curriculum (KSSR). Strong communication skills and a passion for inspiring young learners is essential.",
    datePosted: daysAgo(10),
  },
  {
    jobId: "job-9",
    title: "Marketing Manager",
    company: "AirAsia",
    state: "Selangor",
    district: "Sepang",
    jobType: JobType.fullTime,
    salaryMin: 8000n,
    salaryMax: 13000n,
    salaryCurrency: "MYR",
    description:
      "Lead integrated marketing campaigns for AirAsia's regional routes. You will manage brand strategy, digital media, partnerships, and a creative team of 6, reporting directly to the CMO.",
    datePosted: daysAgo(3),
  },
  {
    jobId: "job-10",
    title: "Pharmacist",
    company: "Guardian Health & Beauty",
    state: "Penang",
    district: "Bayan Lepas",
    jobType: JobType.partTime,
    salaryMin: 2800n,
    salaryMax: 4200n,
    salaryCurrency: "MYR",
    description:
      "Dispense medications, counsel patients on proper drug use, and manage inventory at our Bayan Lepas outlet. Part-time role ideal for registered pharmacists seeking flexible work arrangements.",
    datePosted: daysAgo(8),
  },
  {
    jobId: "job-11",
    title: "Cloud Solutions Architect",
    company: "Telekom Malaysia",
    state: "Kuala Lumpur",
    district: "Bangsar",
    jobType: JobType.fullTime,
    salaryMin: 12000n,
    salaryMax: 18000n,
    salaryCurrency: "MYR",
    description:
      "Design and oversee cloud architecture for enterprise clients migrating to AWS and Azure. You will lead pre-sales engagements, solution design workshops, and technical reviews for Fortune 500 companies across Malaysia.",
    datePosted: daysAgo(1),
  },
  {
    jobId: "job-12",
    title: "Accounts Executive",
    company: "PricewaterhouseCoopers Malaysia",
    state: "Johor",
    district: "Iskandar Puteri",
    jobType: JobType.contract,
    salaryMin: 4000n,
    salaryMax: 6000n,
    salaryCurrency: "MYR",
    description:
      "Support audit and assurance engagements for manufacturing and retail clients in the Iskandar region. You will assist with financial statement analysis, compliance checks, and client reporting on a 12-month contract.",
    datePosted: daysAgo(9),
  },
  {
    jobId: "job-13",
    title: "Software Engineer (Mobile)",
    company: "Fusionex International",
    state: "Sabah",
    district: "Kota Kinabalu",
    jobType: JobType.remote,
    salaryMin: 5500n,
    salaryMax: 8500n,
    salaryCurrency: "MYR",
    description:
      "Develop cross-platform mobile applications for our data analytics suite using React Native and Flutter. Fully remote role based in Sabah or anywhere in Malaysia. Strong portfolio of shipped mobile apps required.",
    datePosted: daysAgo(2),
  },
  {
    jobId: "job-14",
    title: "Operations Manager",
    company: "Top Glove Corporation",
    state: "Perak",
    district: "Ipoh",
    jobType: JobType.fullTime,
    salaryMin: 9000n,
    salaryMax: 14000n,
    salaryCurrency: "MYR",
    description:
      "Oversee daily manufacturing operations at our Ipoh production facility, managing a team of 150+ staff. Drive continuous improvement initiatives, ensure KPI targets are met, and uphold the highest quality and safety standards.",
    datePosted: daysAgo(12),
  },
  {
    jobId: "job-15",
    title: "Graphic Designer",
    company: "Star Media Group",
    state: "Selangor",
    district: "Petaling Jaya",
    jobType: JobType.partTime,
    salaryMin: 2500n,
    salaryMax: 4000n,
    salaryCurrency: "MYR",
    description:
      "Create compelling visual content for print, digital, and social media channels. Proficiency in Adobe Creative Suite (Illustrator, Photoshop, InDesign) is required. Part-time, 3 days per week.",
    datePosted: daysAgo(6),
  },
  {
    jobId: "job-16",
    title: "Quantity Surveyor",
    company: "IJM Corporation",
    state: "Sarawak",
    district: "Kuching",
    jobType: JobType.contract,
    salaryMin: 5000n,
    salaryMax: 7500n,
    salaryCurrency: "MYR",
    description:
      "Manage cost estimation, procurement, and contract administration for large-scale infrastructure projects in Sarawak. The role requires a professional QS certification and 4+ years of experience in civil construction.",
    datePosted: daysAgo(14),
  },
  {
    jobId: "job-17",
    title: "Digital Marketing Specialist",
    company: "Lazada Malaysia",
    state: "Kuala Lumpur",
    district: "Chow Kit",
    jobType: JobType.remote,
    salaryMin: 4500n,
    salaryMax: 7000n,
    salaryCurrency: "MYR",
    description:
      "Plan and execute performance marketing campaigns across Google Ads, Meta, and TikTok for Malaysia's leading e-commerce platform. Fully remote with flexible hours.",
    datePosted: daysAgo(4),
  },
  {
    jobId: "job-18",
    title: "HR Business Partner",
    company: "Petronas",
    state: "Kedah",
    district: "Alor Setar",
    jobType: JobType.fullTime,
    salaryMin: 7000n,
    salaryMax: 11000n,
    salaryCurrency: "MYR",
    description:
      "Partner with business leaders to develop and implement people strategies, manage talent acquisition, employee relations, and organizational development for our upstream operations in Kedah.",
    datePosted: daysAgo(7),
  },
  {
    jobId: "job-19",
    title: "Biomedical Engineer",
    company: "Hospital Tengku Ampuan Afzan",
    state: "Pahang",
    district: "Kuantan",
    jobType: JobType.fullTime,
    salaryMin: 4500n,
    salaryMax: 7000n,
    salaryCurrency: "MYR",
    description:
      "Maintain, calibrate, and troubleshoot medical equipment including MRI, CT scanners, and ultrasound machines. Work closely with clinical teams to ensure medical devices are fully operational and compliant with standards.",
    datePosted: daysAgo(11),
  },
  {
    jobId: "job-20",
    title: "Finance Manager",
    company: "Sunway Group",
    state: "Negeri Sembilan",
    district: "Seremban",
    jobType: JobType.fullTime,
    salaryMin: 10000n,
    salaryMax: 16000n,
    salaryCurrency: "MYR",
    description:
      "Lead the finance function for Sunway's Seremban division, overseeing budgeting, forecasting, statutory reporting, and treasury management. CPA/ACCA qualified with 8+ years of experience required.",
    datePosted: daysAgo(5),
  },
];

export const STATES = [...new Set(SAMPLE_JOBS.map((j) => j.state))].sort();

export function getDistrictsForState(state: string): string[] {
  return [
    ...new Set(
      SAMPLE_JOBS.filter((j) => j.state === state).map((j) => j.district),
    ),
  ].sort();
}

export function formatSalary(
  min: bigint,
  max: bigint,
  currency: string,
): string {
  const fmt = (n: bigint) => {
    const num = Number(n);
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };
  return `${currency} ${fmt(min)} – ${fmt(max)}`;
}

export function timeAgo(nanos: bigint): string {
  const ms = Number(nanos / 1_000_000n);
  const diff = Date.now() - ms;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

export function jobTypeLabel(type: JobType): string {
  switch (type) {
    case JobType.fullTime:
      return "Full-time";
    case JobType.partTime:
      return "Part-time";
    case JobType.contract:
      return "Contract";
    case JobType.remote:
      return "Remote";
  }
}
