import { JobType, VacancyStatus } from "../backend.d";

export interface JobListing {
  title: string;
  salaryCurrency: string;
  jobType: JobType;
  jobId: string;
  description: string;
  district: string;
  company: string;
  state: string;
  country: string;
  city: string;
  status: VacancyStatus;
  datePosted: bigint;
  salaryMax: bigint;
  salaryMin: bigint;
}

export const INDIAN_STATES: string[] = [
  "Andaman & Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

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
    company: "Infosys",
    state: "Karnataka",
    district: "Bengaluru",
    country: "India",
    city: "Bengaluru",
    status: VacancyStatus.new_,
    jobType: JobType.fullTime,
    salaryMin: 120000n,
    salaryMax: 200000n,
    salaryCurrency: "INR",
    description:
      "Join our engineering team to build next-generation digital products. Design, develop, and maintain scalable backend services using Node.js and Java, working closely with product managers and UX designers across India.",
    datePosted: daysAgo(2),
  },
  {
    jobId: "job-2",
    title: "Full Stack Developer",
    company: "Wipro Technologies",
    state: "Maharashtra",
    district: "Mumbai",
    country: "India",
    city: "Mumbai",
    status: VacancyStatus.new_,
    jobType: JobType.fullTime,
    salaryMin: 80000n,
    salaryMax: 150000n,
    salaryCurrency: "INR",
    description:
      "Build and maintain enterprise tools and customer-facing solutions. Experience with React, TypeScript, and Java Spring Boot is essential. Collaborate with cross-functional teams across India.",
    datePosted: daysAgo(4),
  },
  {
    jobId: "job-3",
    title: "Product Designer (UI/UX)",
    company: "Flipkart",
    state: "Karnataka",
    district: "Bengaluru",
    country: "India",
    city: "Bengaluru",
    status: VacancyStatus.new_,
    jobType: JobType.fullTime,
    salaryMin: 90000n,
    salaryMax: 160000n,
    salaryCurrency: "INR",
    description:
      "Design intuitive and delightful experiences for Flipkart's e-commerce platform. Conduct user research, create wireframes and high-fidelity designs using Figma, and work with engineers to ship polished features.",
    datePosted: daysAgo(1),
  },
  {
    jobId: "job-4",
    title: "Registered Nurse (ICU)",
    company: "Apollo Hospitals",
    state: "Tamil Nadu",
    district: "Chennai",
    country: "India",
    city: "Chennai",
    status: VacancyStatus.new_,
    jobType: JobType.fullTime,
    salaryMin: 40000n,
    salaryMax: 70000n,
    salaryCurrency: "INR",
    description:
      "Provide high-quality patient care in our Intensive Care Unit. Monitor vital signs, administer medications, coordinate with physicians, and support patients and families during critical periods.",
    datePosted: daysAgo(3),
  },
  {
    jobId: "job-5",
    title: "Data Analyst",
    company: "HDFC Bank",
    state: "Maharashtra",
    district: "Pune",
    country: "India",
    city: "Pune",
    status: VacancyStatus.new_,
    jobType: JobType.fullTime,
    salaryMin: 65000n,
    salaryMax: 110000n,
    salaryCurrency: "INR",
    description:
      "Analyze complex datasets to provide actionable insights for retail banking strategies. Build dashboards in Power BI, write SQL queries, and present findings to senior stakeholders to drive data-driven decisions.",
    datePosted: daysAgo(6),
  },
  {
    jobId: "job-6",
    title: "Frontend Developer (React)",
    company: "Swiggy",
    state: "Telangana",
    district: "Hyderabad",
    country: "India",
    city: "Hyderabad",
    status: VacancyStatus.new_,
    jobType: JobType.remote,
    salaryMin: 70000n,
    salaryMax: 130000n,
    salaryCurrency: "INR",
    description:
      "Work remotely building high-performance food delivery interfaces. Proficiency in React, TypeScript, and performance optimization required. Collaborate with teams across India.",
    datePosted: daysAgo(7),
  },
  {
    jobId: "job-7",
    title: "Civil Engineer",
    company: "L&T Construction",
    state: "Delhi",
    district: "New Delhi",
    country: "India",
    city: "New Delhi",
    status: VacancyStatus.new_,
    jobType: JobType.fullTime,
    salaryMin: 60000n,
    salaryMax: 100000n,
    salaryCurrency: "INR",
    description:
      "Support design and construction of major infrastructure projects including highways, metro lines, and bridges. Conduct site inspections, prepare technical reports, and liaise with contractors and government agencies.",
    datePosted: daysAgo(5),
  },
  {
    jobId: "job-8",
    title: "Primary School Teacher (Science)",
    company: "Kendriya Vidyalaya",
    state: "Uttar Pradesh",
    district: "Lucknow",
    country: "India",
    city: "Lucknow",
    status: VacancyStatus.new_,
    jobType: JobType.fullTime,
    salaryMin: 35000n,
    salaryMax: 55000n,
    salaryCurrency: "INR",
    description:
      "Teach Science to Classes 6-8, creating engaging lesson plans aligned with NCERT curriculum. Strong communication skills and passion for inspiring young learners is essential.",
    datePosted: daysAgo(10),
  },
  {
    jobId: "job-9",
    title: "Marketing Manager",
    company: "IndiGo Airlines",
    state: "Delhi",
    district: "Gurugram",
    country: "India",
    city: "Gurugram",
    status: VacancyStatus.new_,
    jobType: JobType.fullTime,
    salaryMin: 100000n,
    salaryMax: 180000n,
    salaryCurrency: "INR",
    description:
      "Lead integrated marketing campaigns for IndiGo's domestic and international routes. Manage brand strategy, digital media, partnerships, and a creative team of 6, reporting directly to the CMO.",
    datePosted: daysAgo(3),
  },
  {
    jobId: "job-10",
    title: "Pharmacist",
    company: "MedPlus Health Services",
    state: "Andhra Pradesh",
    district: "Visakhapatnam",
    country: "India",
    city: "Visakhapatnam",
    status: VacancyStatus.new_,
    jobType: JobType.partTime,
    salaryMin: 25000n,
    salaryMax: 45000n,
    salaryCurrency: "INR",
    description:
      "Dispense medications, counsel patients on proper drug use, and manage inventory. Part-time role ideal for registered pharmacists seeking flexible work arrangements.",
    datePosted: daysAgo(8),
  },
  {
    jobId: "job-11",
    title: "Cloud Solutions Architect",
    company: "Tata Consultancy Services",
    state: "Maharashtra",
    district: "Mumbai",
    country: "India",
    city: "Mumbai",
    status: VacancyStatus.new_,
    jobType: JobType.fullTime,
    salaryMin: 160000n,
    salaryMax: 280000n,
    salaryCurrency: "INR",
    description:
      "Design and oversee cloud architecture for enterprise clients migrating to AWS and Azure. Lead pre-sales engagements, solution design workshops, and technical reviews for Fortune 500 companies across India.",
    datePosted: daysAgo(1),
  },
  {
    jobId: "job-12",
    title: "Accounts Executive",
    company: "Deloitte India",
    state: "Gujarat",
    district: "Ahmedabad",
    country: "India",
    city: "Ahmedabad",
    status: VacancyStatus.new_,
    jobType: JobType.contract,
    salaryMin: 50000n,
    salaryMax: 80000n,
    salaryCurrency: "INR",
    description:
      "Support audit and assurance engagements for manufacturing and retail clients. Assist with financial statement analysis, compliance checks, and client reporting on a 12-month contract.",
    datePosted: daysAgo(9),
  },
  {
    jobId: "job-13",
    title: "Software Engineer (Mobile)",
    company: "Ola Electric",
    state: "Karnataka",
    district: "Bengaluru",
    country: "India",
    city: "Bengaluru",
    status: VacancyStatus.new_,
    jobType: JobType.remote,
    salaryMin: 75000n,
    salaryMax: 130000n,
    salaryCurrency: "INR",
    description:
      "Develop cross-platform mobile applications for Ola's EV ecosystem using React Native. Fully remote role. Strong portfolio of shipped mobile apps required.",
    datePosted: daysAgo(2),
  },
  {
    jobId: "job-14",
    title: "Operations Manager",
    company: "Reliance Industries",
    state: "Gujarat",
    district: "Surat",
    country: "India",
    city: "Surat",
    status: VacancyStatus.old,
    jobType: JobType.fullTime,
    salaryMin: 120000n,
    salaryMax: 200000n,
    salaryCurrency: "INR",
    description:
      "Oversee daily manufacturing operations, managing a team of 150+ staff. Drive continuous improvement initiatives, ensure KPI targets are met, and uphold the highest quality and safety standards.",
    datePosted: daysAgo(12),
  },
  {
    jobId: "job-15",
    title: "Graphic Designer",
    company: "Times of India Group",
    state: "Maharashtra",
    district: "Pune",
    country: "India",
    city: "Pune",
    status: VacancyStatus.old,
    jobType: JobType.partTime,
    salaryMin: 30000n,
    salaryMax: 55000n,
    salaryCurrency: "INR",
    description:
      "Create compelling visual content for print, digital, and social media channels. Proficiency in Adobe Creative Suite is required. Part-time, 3 days per week.",
    datePosted: daysAgo(6),
  },
  {
    jobId: "job-16",
    title: "Quantity Surveyor",
    company: "Shapoorji Pallonji",
    state: "West Bengal",
    district: "Kolkata",
    country: "India",
    city: "Kolkata",
    status: VacancyStatus.old,
    jobType: JobType.contract,
    salaryMin: 60000n,
    salaryMax: 95000n,
    salaryCurrency: "INR",
    description:
      "Manage cost estimation, procurement, and contract administration for large-scale infrastructure projects. Professional QS certification and 4+ years of civil construction experience required.",
    datePosted: daysAgo(14),
  },
  {
    jobId: "job-17",
    title: "Digital Marketing Specialist",
    company: "Amazon India",
    state: "Karnataka",
    district: "Bengaluru",
    country: "India",
    city: "Bengaluru",
    status: VacancyStatus.new_,
    jobType: JobType.remote,
    salaryMin: 60000n,
    salaryMax: 100000n,
    salaryCurrency: "INR",
    description:
      "Plan and execute performance marketing campaigns across Google Ads, Meta, and YouTube for India's leading e-commerce platform. Fully remote with flexible hours.",
    datePosted: daysAgo(4),
  },
  {
    jobId: "job-18",
    title: "HR Business Partner",
    company: "ONGC",
    state: "Jammu & Kashmir",
    district: "Srinagar",
    country: "India",
    city: "Srinagar",
    status: VacancyStatus.old,
    jobType: JobType.fullTime,
    salaryMin: 80000n,
    salaryMax: 130000n,
    salaryCurrency: "INR",
    description:
      "Partner with business leaders to develop and implement people strategies, manage talent acquisition, employee relations, and organizational development for our operations in J&K.",
    datePosted: daysAgo(7),
  },
  {
    jobId: "job-19",
    title: "Biomedical Engineer",
    company: "AIIMS",
    state: "Delhi",
    district: "New Delhi",
    country: "India",
    city: "New Delhi",
    status: VacancyStatus.new_,
    jobType: JobType.fullTime,
    salaryMin: 55000n,
    salaryMax: 90000n,
    salaryCurrency: "INR",
    description:
      "Maintain, calibrate, and troubleshoot medical equipment including MRI, CT scanners, and ultrasound machines. Work closely with clinical teams to ensure medical devices are fully operational and compliant.",
    datePosted: daysAgo(11),
  },
  {
    jobId: "job-20",
    title: "Finance Manager",
    company: "Mahindra & Mahindra",
    state: "Tamil Nadu",
    district: "Kanyakumari",
    country: "India",
    city: "Kanyakumari",
    status: VacancyStatus.old,
    jobType: JobType.fullTime,
    salaryMin: 130000n,
    salaryMax: 220000n,
    salaryCurrency: "INR",
    description:
      "Lead the finance function for Mahindra's southern division, overseeing budgeting, forecasting, statutory reporting, and treasury management. CPA/CA qualified with 8+ years of experience required.",
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
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
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
