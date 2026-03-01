# Job Vacancy App

## Current State
A job board app for India. Features:
- Sticky header with logo and nav links
- Hero section with stats
- Filter bar (search, state, district, job type)
- Job card grid with Apply Now modal
- Footer

No side menu or user authentication exists.

## Requested Changes (Diff)

### Add
- Hamburger menu button in the header (top-left or alongside logo)
- Slide-out side drawer (from the left) with 8 menu items:
  1. Sign Up / Login -- opens a modal or panel for auth (simulated UI)
  2. Themes -- lets user switch between light/dark/system themes
  3. Locations -- shows a panel listing all states/districts covered
  4. Your ID -- shows a "My Profile" card (placeholder with name/email if logged in, else prompt to sign up)
  5. New Vacancy -- form to post a new job listing (title, company, location, type, salary, description)
  6. Old Vacancy -- list of previously posted vacancies (placeholder data)
  7. Draft Vacancy -- list of draft/unsaved vacancies (placeholder data)
  8. Add Post -- simple form to compose a general job-related post/announcement
- Close button and backdrop overlay for the drawer
- Active menu item highlight

### Modify
- Header: add a menu toggle button (hamburger icon) on the left side
- App layout: wrap in a context/state that tracks open drawer + active section

### Remove
- Nothing removed

## Implementation Plan
1. Create `SideMenu.tsx` component: slide-in drawer with framer-motion, backdrop, close button, 8 menu items with icons
2. Create panel components for each menu item:
   - `AuthPanel.tsx` (Sign Up / Login form)
   - `ThemesPanel.tsx` (light/dark/system toggle)
   - `LocationsPanel.tsx` (list of states and districts)
   - `YourIdPanel.tsx` (user profile placeholder)
   - `NewVacancyPanel.tsx` (post a new job form)
   - `OldVacancyPanel.tsx` (list of past vacancies)
   - `DraftVacancyPanel.tsx` (list of draft vacancies)
   - `AddPostPanel.tsx` (compose a post form)
3. Add theme context in `main.tsx` or a new `ThemeProvider`
4. Update `App.tsx` to include the hamburger button and `SideMenu` with panel rendering
