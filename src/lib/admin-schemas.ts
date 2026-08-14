import type { TableSchema } from "@/components/admin/TableEditor";

export const heroSchema: TableSchema = {
  table: "hero",
  label: "Hero",
  singleton: true,
  titleKey: "headline",
  fields: [
    { key: "name", label: "Name", type: "text" },
    { key: "headline", label: "Headline", type: "textarea" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "roles", label: "Roles (comma separated)", type: "array" },
    { key: "primary_cta_label", label: "Primary CTA label", type: "text" },
    { key: "primary_cta_url", label: "Primary CTA URL", type: "url" },
    { key: "secondary_cta_label", label: "Secondary CTA label", type: "text" },
    { key: "secondary_cta_url", label: "Secondary CTA URL", type: "url" },
    { key: "availability_status", label: "Availability status", type: "text" },
    { key: "model_path", label: "3D model path", type: "text" },
    { key: "stats", label: "Stats (JSON array of {label,value})", type: "json" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true, roles: [], stats: [] },
};

export const aboutSchema: TableSchema = {
  table: "about",
  label: "About",
  singleton: true,
  titleKey: "biography",
  fields: [
    { key: "profile_image_url", label: "Profile Photo", type: "image", help: "Upload your profile photo for the About section." },
    { key: "banner_media_type", label: "Banner Media Type ('video' or 'image')", type: "text", help: "Enter 'video' to display video or 'image' to display image." },
    { key: "banner_image_url", label: "Banner Image", type: "image", help: "Upload banner image." },
    { key: "banner_video_url", label: "Banner Video", type: "video", help: "Upload or paste URL for banner video." },
    { key: "biography", label: "Biography", type: "textarea" },
    { key: "story", label: "Story", type: "textarea" },
    { key: "mission", label: "Mission", type: "textarea" },
    { key: "vision", label: "Vision", type: "textarea" },
    { key: "years_experience", label: "Years of experience", type: "number" },
    { key: "signature_url", label: "Signature image", type: "image" },
    { key: "highlights", label: "Highlights (JSON array)", type: "json" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true, highlights: [], banner_media_type: "video" },
};

export const projectsSchema: TableSchema = {
  table: "projects",
  label: "Projects",
  titleKey: "title",
  subtitleKey: "short_description",
  fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "slug", label: "Slug", type: "text", help: "URL-safe. Used in /projects/<slug>" },
    { key: "category", label: "Category", type: "text" },
    { key: "short_description", label: "Short description", type: "textarea" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "problem", label: "Problem", type: "textarea" },
    { key: "solution", label: "Solution", type: "textarea" },
    { key: "technologies", label: "Technologies (comma separated)", type: "array" },
    { key: "features", label: "Features (JSON array of strings)", type: "json" },
    { key: "thumbnail_url", label: "Thumbnail image", type: "image" },
    { key: "cover_url", label: "Cover image", type: "image" },

    { key: "github_url", label: "GitHub URL", type: "url" },
    { key: "live_url", label: "Live URL", type: "url" },
    { key: "case_study_url", label: "Case study URL", type: "url" },
    { key: "status", label: "Status", type: "text", help: "e.g. Live, In Progress, Archived" },
    { key: "in_progress", label: "In Progress", type: "boolean", help: "Show 'In Progress' live badge on project card" },
    { key: "completion_date", label: "Completion date", type: "date" },
    { key: "featured", label: "Featured", type: "boolean" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true, in_progress: false, featured: false, display_order: 0, technologies: [], features: [] },
};

export const skillsSchema: TableSchema = {
  table: "skills",
  label: "Skills",
  titleKey: "name",
  subtitleKey: "category",
  fields: [
    { key: "name", label: "Name", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "icon", label: "Icon", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "experience_level", label: "Experience level", type: "text", help: "e.g. Expert, Advanced, Intermediate" },
    { key: "years", label: "Years", type: "number" },
    { key: "featured", label: "Featured", type: "boolean" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true, display_order: 0 },
};

export const technologiesSchema: TableSchema = {
  table: "technologies",
  label: "Technologies",
  titleKey: "name",
  subtitleKey: "category",
  fields: [
    { key: "name", label: "Name", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "logo_url", label: "Logo image", type: "image" },

    { key: "website", label: "Website", type: "url" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "featured", label: "Featured", type: "boolean" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true, display_order: 0 },
};

export const servicesSchema: TableSchema = {
  table: "services",
  label: "Services",
  titleKey: "title",
  subtitleKey: "description",
  fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "icon", label: "Icon", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "features", label: "Features (JSON array of strings)", type: "json" },
    { key: "price", label: "Price", type: "text" },
    { key: "timeline", label: "Timeline", type: "text" },
    { key: "cta_label", label: "CTA label", type: "text" },
    { key: "cta_url", label: "CTA URL", type: "url" },
    { key: "featured", label: "Featured", type: "boolean" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true, features: [], display_order: 0 },
};

export const experienceSchema: TableSchema = {
  table: "experience",
  label: "Experience",
  titleKey: "role",
  subtitleKey: "company",
  fields: [
    { key: "role", label: "Role", type: "text" },
    { key: "company", label: "Company", type: "text" },
    { key: "logo_url", label: "Company logo", type: "image" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "start_date", label: "Start date", type: "date" },
    { key: "end_date", label: "End date", type: "date" },
    { key: "current", label: "Currently working here", type: "boolean" },
    { key: "achievements", label: "Achievements (JSON array of strings)", type: "json" },
    { key: "skills_used", label: "Skills used (comma separated)", type: "array" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true, achievements: [], skills_used: [], display_order: 0 },
};

export const educationSchema: TableSchema = {
  table: "education",
  label: "Education",
  titleKey: "degree",
  subtitleKey: "institution",
  fields: [
    { key: "institution", label: "Institution", type: "text" },
    { key: "logo_url", label: "Institution logo", type: "image" },
    { key: "degree", label: "Degree", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "start_date", label: "Start date", type: "date" },
    { key: "end_date", label: "End date", type: "date" },
    { key: "achievements", label: "Achievements (JSON array)", type: "json" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true, achievements: [], display_order: 0 },
};

export const certificatesSchema: TableSchema = {
  table: "certificates",
  label: "Certificates",
  titleKey: "name",
  subtitleKey: "organization",
  fields: [
    { key: "name", label: "Name", type: "text" },
    { key: "organization", label: "Organization", type: "text" },
    { key: "issue_date", label: "Issue date", type: "date" },
    { key: "credential_url", label: "Credential URL", type: "url" },
    { key: "image_url", label: "Certificate image", type: "image" },
    { key: "pdf_url", label: "PDF URL", type: "url" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true, display_order: 0 },
};

export const socialLinksSchema: TableSchema = {
  table: "social_links",
  label: "Social Links",
  titleKey: "platform",
  subtitleKey: "url",
  fields: [
    { key: "platform", label: "Platform", type: "text", help: "e.g. github, linkedin, instagram, mail" },
    { key: "url", label: "URL", type: "url" },
    { key: "icon", label: "Icon key", type: "text" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true, display_order: 0 },
};

export const settingsSchema: TableSchema = {
  table: "settings",
  label: "Settings",
  titleKey: "key",
  fields: [
    { key: "key", label: "Key", type: "text", help: "'public' is exposed publicly. Other keys are admin-only." },
    { key: "value", label: "Value (JSON)", type: "json", help: 'Add fields like {"availability_status":"Available for work","resume_url":"https://…"}' },
  ],
  defaults: { value: {} },
};

export const seoSchema: TableSchema = {
  table: "seo",
  label: "SEO",
  titleKey: "page_key",
  subtitleKey: "title",
  fields: [
    { key: "page_key", label: "Page key", type: "text", help: "e.g. global, home, projects" },
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "keywords", label: "Keywords (comma separated)", type: "array" },
    { key: "og_image_url", label: "OG image", type: "image" },
    { key: "canonical_url", label: "Canonical URL", type: "url" },
    { key: "twitter_card", label: "Twitter card", type: "text" },
    { key: "structured_data", label: "Structured data (JSON-LD)", type: "json" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: { is_active: true },
};

export const resumeSchema: TableSchema = {
  table: "resume",
  label: "Resume Controls",
  singleton: true,
  titleKey: "full_name",
  fields: [
    { key: "full_name", label: "Full Name", type: "text" },
    { key: "title_roles", label: "Professional Roles (comma separated)", type: "array", help: "e.g. Full Stack Developer, 3D Web Developer" },
    { key: "summary", label: "Resume Summary", type: "textarea", help: "Custom summary/objective statement for the resume page" },
    { key: "email", label: "Contact Email", type: "text" },
    { key: "phone", label: "Contact Phone", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "website_url", label: "Website URL", type: "url" },
    { key: "github_url", label: "GitHub URL", type: "url" },
    { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
    { key: "pdf_url", label: "Downloadable PDF URL", type: "url", help: "Direct link or uploaded PDF file for Download Resume button" },

    { key: "summary_title", label: "Summary Section Header", type: "text" },
    { key: "show_summary", label: "Show Summary Section", type: "boolean" },

    { key: "skills_title", label: "Skills Section Header", type: "text" },
    { key: "show_skills", label: "Show Skills Section", type: "boolean" },
    { key: "resume_skills", label: "Skills List (JSON array of {name, category, level})", type: "json", help: "Edit resume skills directly" },

    { key: "tech_stack_title", label: "Tech Stack Section Header", type: "text" },
    { key: "show_tech_stack", label: "Show Tech Stack Section", type: "boolean" },
    { key: "resume_tech_stack", label: "Tech Stack Items (comma separated)", type: "array", help: "Edit resume tech stack items directly" },

    { key: "experience_title", label: "Experience Section Header", type: "text" },
    { key: "show_experience", label: "Show Experience Section", type: "boolean" },
    { key: "resume_experience", label: "Experience Entries (JSON array of {role, company, start_date, end_date, current, description, achievements, skills_used})", type: "json", help: "Edit experience roles & bullet achievements directly" },

    { key: "projects_title", label: "Projects Section Header", type: "text" },
    { key: "show_projects", label: "Show Projects Section", type: "boolean" },
    { key: "resume_projects", label: "Selected Projects (JSON array of {title, short_description, technologies, live_url})", type: "json", help: "Edit selected projects directly" },

    { key: "education_title", label: "Education Section Header", type: "text" },
    { key: "show_education", label: "Show Education Section", type: "boolean" },
    { key: "resume_education", label: "Education Entries (JSON array of {degree, institution, start_date, end_date, description, achievements})", type: "json", help: "Edit education degrees & institutions directly" },

    { key: "certificates_title", label: "Certifications Section Header", type: "text" },
    { key: "show_certificates", label: "Show Certifications Section", type: "boolean" },
    { key: "resume_certificates", label: "Certifications Entries (JSON array of {name, organization, issue_date, credential_url})", type: "json", help: "Edit certifications directly" },

    { key: "is_active", label: "Active", type: "boolean" },
  ],
  defaults: {
    summary_title: "Summary",
    skills_title: "Skills",
    tech_stack_title: "Tech Stack",
    experience_title: "Experience",
    projects_title: "Selected Projects",
    education_title: "Education",
    certificates_title: "Certifications",
    show_summary: true,
    show_skills: true,
    show_tech_stack: true,
    show_experience: true,
    show_projects: true,
    show_education: true,
    show_certificates: true,
    resume_skills: [],
    resume_tech_stack: [],
    resume_experience: [],
    resume_education: [],
    resume_projects: [],
    resume_certificates: [],
    is_active: true,
    title_roles: [],
  },
};

export const adminSchemas = {
  hero: heroSchema,
  about: aboutSchema,
  resume: resumeSchema,
  projects: projectsSchema,
  skills: skillsSchema,
  technologies: technologiesSchema,
  services: servicesSchema,
  experience: experienceSchema,
  education: educationSchema,
  certificates: certificatesSchema,
  social_links: socialLinksSchema,
  settings: settingsSchema,
  seo: seoSchema,
};
