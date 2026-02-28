# Job Vacancy App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Job listings page showing vacancies with title, company, location (district/state), job type, salary range, brief description, and date posted
- Filter bar with: state dropdown, district dropdown (dynamic based on state), job type dropdown, and search bar (by title or company)
- "Apply Now" button on each job card opening a modal application form with: name, email, phone, resume upload, cover letter textarea, and submit with confirmation
- At least 15 sample job listings across multiple states/districts and industries (Tech, Healthcare, Finance, Education, etc.)
- Backend: store job listings, store applications submitted by users

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend (Motoko):
   - `Job` data type: id, title, company, district, state, jobType, salaryMin, salaryMax, description, datePosted
   - `Application` data type: id, jobId, applicantName, email, phone, coverLetter, submittedAt
   - `getJobs()` query: returns all jobs
   - `submitApplication(jobId, applicantName, email, phone, coverLetter)` update: stores application, returns ok/err

2. Frontend:
   - Seed 15+ sample jobs in frontend state (static data, not from backend seed)
   - Job listing cards with all required fields and hover effects
   - Filter bar (top): state, district (dynamic), job type dropdowns + search bar
   - Apply Now modal form with all fields; resume upload handled client-side (file input, not uploaded to backend)
   - Confirmation message on successful submission (calls backend submitApplication)
   - Responsive layout for mobile and desktop
