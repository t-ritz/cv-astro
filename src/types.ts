export interface SocialLinks {
  linkedin: string
  github: string
  orcid: string
  email: string
}

export interface SectionMeta {
  eyebrow: string
  title: string
}

export interface CompanyLink {
  name: string
  url: string
}

export interface Job {
  company: string
  companyLinks: CompanyLink[]
  location: string
  begin: string
  end: string
  contract: string
  occupation: string
  description: string
}

export interface Education {
  school: string
  url: string
  degree: string
  field: string
  mention: string
  startYear: number
  endYear: number
}

export interface Publication {
  date: string
  title: string
  venue: string
  url: string
  description: string
}

export interface Language {
  flag: string
  code: string
  name: string
  level: string
}

export interface Activity {
  name: string
  url: string
  position: string
  description: string
}

export interface SiteConfig {
  lang: string
  siteTitle: string
  siteDescription: string
  eyebrow: string
  authorName: string
  authorAvatar: string
  authorDescription: string
  resume: string
  social: SocialLinks
  nav: Record<string, string>
  sections: Record<string, SectionMeta>
  labels: {
    downloadCV: string
    hoverToRead: string
    seeMore : string
    seeLess : string
  }
  expertise: string[]
  jobs: Job[]
  education: Education[]
  publications: Publication[]
  languages: Language[]
  activities: Activity[]
  hobbies: string[]
}
