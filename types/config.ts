export interface NavLink {
  name: string
  url: string
  id: string
}

export interface SearchEngine {
  name: string
  url: string
  placeholder?: string
  icon?: string
  color?: string
}

export interface SiteLink {
  name: string
  url: string
  icon: string
}

export interface Category {
  title: string
  icon: string
  links: SiteLink[]
}

export interface Copyright {
  show: boolean
  text: string
  target: string
  showRecord: boolean
  record: string
  recordUrl: string
}

export interface SiteConfig {
  title: string
  keywords: string
  description: string
  author: string
  favicon: string
  backgroundImage: string
  links: {
    navItems: NavLink[]
    searchEngines: SearchEngine[]
    categories: Category[]
  }
  copyright: Copyright
}