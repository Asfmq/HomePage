# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal homepage/navigation site based on the lylme theme from 六零导航页. It can be deployed as a static site or run with a Node.js backend for administrative configuration.

## Commands

### Development
```bash
# Install dependencies
npm install

# Start the development server with admin interface
node server.js

# Access the admin interface at: http://localhost:3000/admin.html
# Access the frontend at: http://localhost:3000/
```

### Docker Deployment
```bash
# Create html directory and start container
mkdir html
docker-compose up -d
```

### Static Deployment
The project can be deployed statically by serving the files with nginx or any web server after configuration.

## Architecture

### Backend (server.js)
- **Express.js server** running on port 3000 (configurable via PORT env var)
- **JWT authentication** for admin access with configurable password
- **Configuration management** through REST API endpoints
- **Site fetching capability** using cheerio and node-fetch to automatically extract website titles and favicons
- **File-based configuration** stored in config.js
- **Password change functionality** with automatic server restart

### Frontend Structure
- **index.html**: Main navigation page
- **admin.html**: Administrative interface for configuration (requires authentication)
- **login.html**: Login page for admin access
- **local/**: Local services section

### Configuration System
- **config.js**: Main configuration file containing:
  - Site metadata (title, description, author, favicon, background)
  - Navigation items and categories
  - Search engines configuration
  - Copyright and legal information

### Authentication Flow
1. Login via POST `/admin/login` with password
2. Receive JWT token valid for 24 hours
3. Include token in query params or Authorization header for protected routes
4. Protected routes: `/admin.html`, `/admin/*`, `/api/*`

### Key API Endpoints
- `GET /config` - Read full configuration (requires auth)
- `POST /config` - Update configuration (requires auth)
- `GET /public-config` - Read safe public configuration
- `GET /fetch-site-info?url=X` - Fetch website metadata
- `POST /api/change-password` - Change admin password (requires auth)
- `GET /api/verify-token` - Verify JWT token validity

### Dependencies
- **express**: Web server framework
- **jsonwebtoken**: JWT authentication
- **cheerio**: HTML parsing for site info extraction
- **node-fetch**: HTTP requests for fetching site metadata

### Static Assets
- **css/**: Stylesheets including FontAwesome icons
- **js/**: Frontend JavaScript for navigation and admin functionality
- **img/**: Images and icons organized in subdirectories

## Security Notes
- Default admin password is '1235' - should be changed in production
- JWT secret should be customized for production deployments
- Admin interface is protected by JWT authentication
- Configuration changes are persisted to the filesystem

## Deployment Options
1. **With Node.js backend**: Full admin functionality and dynamic configuration
2. **Static deployment**: Configure once, then serve static files with any web server
3. **Docker**: Containerized deployment with all dependencies included