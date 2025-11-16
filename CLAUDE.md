# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern personal homepage built with Nuxt 3, featuring search functionality, categorized links management, and responsive design. The application supports both SSR (Server-Side Rendering) and static generation modes.

## Development Commands

### Core Development
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate` - Generate static site
- `npm install` - Install dependencies

### Testing
- No specific test commands are currently configured

## Architecture Overview

### Tech Stack
- **Frontend**: Nuxt 3 with Vue 3 Composition API
- **Styling**: Tailwind CSS with custom CSS files
- **Backend**: Built-in Nuxt Server API routes
- **Authentication**: JWT-based auth system
- **Icons**: SVG sprite system in `public/icons.svg`

### Key Directories Structure

```
HomePage/
├── components/          # Vue components (IconComponent, SearchBox, IconDebug)
├── pages/              # File-based routing (index.vue, admin.vue, login.vue)
├── server/api/         # API routes (config, auth, site-info, health)
├── utils/              # Utilities and default configuration
├── types/              # TypeScript type definitions
├── assets/             # CSS and JS assets
└── public/             # Static assets including SVG icons
```

### Component System
- **IconComponent.vue**: Unified icon component supporting SVG sprites, images, and text
- **SearchBox.vue**: Multi-search engine component with switching and suggestions
- **IconDebug.vue**: Development tool for icon debugging

### Configuration Management
- **Default Config**: `utils/config.ts` contains default site configuration
- **Dynamic Config**: Runtime configuration stored server-side, manageable via admin panel
- **Type Safety**: Full TypeScript definitions in `types/config.ts`

### API Architecture
- **Config API**: `GET/POST /api/config` - Site configuration management
- **Auth API**: `/api/auth/login`, `/api/auth/verify`, `/api/auth/change-password`
- **Utility API**: `/api/fetch-site-info`, `/api/health`

## Key Configuration Files

### Environment Variables
Set in `nuxt.config.ts` runtime config:
- `adminPassword`: Admin access password (currently hardcoded as '1235')
- `jwtSecret`: JWT signing secret
- `public.apiBase`: API base path

### Site Configuration Structure
The site configuration follows this schema:
- Navigation links (`navItems`)
- Search engines configuration (`searchEngines`)
- Categorized links (`categories`)
- Copyright and site metadata

## Icon System
Icons are managed through an SVG sprite system:
- SVG icons defined in `public/icons.svg` as `<symbol>` elements
- Icons referenced by ID (e.g., `#icon-home`)
- IconComponent automatically detects and renders SVG, image, or text icons

## Development Notes

### Code Style
- Vue 3 Composition API with `<script setup>` syntax
- TypeScript for type safety
- Tailwind CSS for styling with custom performance optimizations

### Security
- JWT-based authentication for admin features
- Server-side configuration management
- Environment variable handling for sensitive data

### Performance
- SSR support for better SEO and loading performance
- CSS optimization in `assets/css/performance.css`
- Component code splitting
- Icon lazy loading

## Common Development Tasks

### Adding New Search Engines
1. Update search engine configuration in `utils/config.ts`
2. Add corresponding icon to `public/icons.svg`
3. Configure SearchBox component with new engine

### Adding New Link Categories
1. Define category structure following `Category` interface
2. Add category data to configuration
3. Icons automatically loaded from SVG sprite

### Modifying Site Configuration
- For development: Edit `utils/config.ts`
- For production: Use admin panel at `/admin` or API endpoints

### Adding New Icons
1. Add SVG `<symbol>` to `public/icons.svg` with unique ID
2. Reference using `#icon-{name}` format in components
3. Use IconDebug component for testing icon display