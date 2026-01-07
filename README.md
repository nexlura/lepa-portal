# Lepa Portal

A comprehensive multi-tenant school management system built with Next.js 15, React 19, and NextAuth. Lepa Portal provides a scalable platform for managing schools, students, teachers, classes, admissions, and administrative operations across multiple agencies and tenants.

**Author**: Nexlura LLC

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [User Roles & Permissions](#user-roles--permissions)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Project Structure](#project-structure)
- [Key Features & Components](#key-features--components)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Lepa Portal is a modern, multi-tenant school management platform designed to handle the complex needs of educational institutions. The system supports a hierarchical structure with:

- **System Administrators**: Full system access and management
- **Agency Administrators**: Manage multiple schools (tenants) within their agency
- **Tenant Administrators**: Manage operations for a specific school
- **Teachers, Students, and Parents**: Role-based access to relevant features

The platform provides comprehensive tools for student enrollment, academic management, teacher administration, class scheduling, and analytics.

## Architecture

### Multi-Tenant Structure

```
System Level
├── Agencies (Educational Organizations)
│   ├── Tenants (Individual Schools)
│   │   ├── Users (Admins, Teachers, Students, Parents)
│   │   ├── Classes
│   │   ├── Students
│   │   └── Teachers
│   └── Agency Users
└── System Users
```

### Key Architectural Patterns

- **Server Components**: Next.js 15 App Router with server-side data fetching
- **Client Components**: Interactive UI elements with React hooks
- **Middleware**: Route protection and role-based redirects
- **API Routes**: NextAuth integration and proxy endpoints
- **RBAC**: Role-Based Access Control with granular permissions

## Features

### Core Functionality

- **Multi-Tenant Management**
  - Agency and tenant creation/management
  - Domain-based tenant isolation
  - Hierarchical user management

- **User Management**
  - System, agency, and tenant user types
  - Role assignment and permission management
  - User profile management

- **Student Management**
  - Student enrollment and records
  - CSV import/export functionality
  - Student profile with academic details
  - Document management
  - Search, filter, sort, and pagination

- **Teacher Management**
  - Teacher profiles and assignments
  - CSV import functionality
  - Class assignments

- **Class Management**
  - Class creation and management
  - Student enrollment in classes
  - Class statistics and analytics

- **Admissions Management**
  - Application tracking
  - Multi-step admission process
  - Application status management

- **Analytics & Reporting**
  - Dashboard analytics for each user type
  - Student/teacher statistics
  - Class performance metrics
  - Agency and tenant overviews

- **Role-Based Access Control (RBAC)**
  - Custom roles and permissions
  - Permission assignment to roles
  - Role assignment to users
  - Resource and action-based permissions

## User Roles & Permissions

### System Administrator
- Full system access
- Manage agencies, tenants, and all users
- Create and manage roles and permissions
- System-wide analytics and reporting

### Agency Administrator
- Manage tenants assigned to their agency
- Create tenant admin users for assigned tenants
- View agency-level analytics
- **Role Assignment Restrictions**: Can only assign "admin" and "teacher" roles

### Tenant Administrator
- Manage their specific school (tenant)
- Create and manage students, teachers, and classes
- School-level analytics and reporting
- **Role Assignment Restrictions**: Can only assign "admin", "teacher", "student", and "parent" roles

### Teachers
- Access to assigned classes
- Student management for their classes
- Grade and attendance management

### Students & Parents
- Access to academic records
- View grades and assignments
- Limited profile management

## Tech Stack

### Frontend
- **Next.js 15.3.5**: React framework with App Router
- **React 19**: UI library
- **TypeScript 5**: Type safety
- **Tailwind CSS 4**: Utility-first styling
- **Headless UI**: Accessible UI components
- **Heroicons**: Icon library
- **Recharts**: Data visualization

### Authentication & Authorization
- **NextAuth 5.0.0-beta.29**: Authentication framework
- **Custom RBAC**: Role and permission management
- **Middleware**: Route protection

### Data Management
- **Axios**: HTTP client
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Development Tools
- **Turbopack**: Fast bundler for development
- **ESLint**: Code linting
- **TypeScript**: Static type checking

## Prerequisites

- **Node.js**: 18+ (20+ recommended)
- **Package Manager**: Yarn (recommended) or npm
- **Backend API**: Access to Lepa API backend

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nexlura/lepa-portal.git
cd lepa-portal
```

### 2. Install Dependencies

```bash
# Using yarn (recommended - yarn.lock present)
yarn install

# Or using npm
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
AUTH_TRUST_HOST=http://localhost:3000

# Backend API
NEXT_PUBLIC_API_URL=https://api.dev.lepa.cc

# Tenant Domain (for multi-tenant routing)
NEXT_PUBLIC_LEPA_HOST_HEADER=schoola.lepa.cc
```

### 4. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and set it as `NEXTAUTH_SECRET` in `.env.local`.

## Development

### Start Development Server

```bash
# Start with Turbopack (faster builds)
yarn dev

# Or with standard Next.js
npm run dev
```

The application will be available at `http://localhost:3000`.

### Linting

```bash
yarn lint
```

### Build for Production

```bash
# Build the application
yarn build

# Start production server
yarn start
```

## Project Structure

```
lepa-portal/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (portal)/                 # Protected portal routes
│   │   │   ├── agency/               # Agency admin routes
│   │   │   │   ├── dashboard/        # Agency dashboard
│   │   │   │   ├── tenants/          # Tenant management
│   │   │   │   └── users/            # User management
│   │   │   ├── system-admin/         # System admin routes
│   │   │   │   ├── dashboard/        # System dashboard
│   │   │   │   ├── users/            # User management
│   │   │   │   ├── tenants/          # Tenant management
│   │   │   │   ├── agencies/         # Agency management
│   │   │   │   └── roles/            # RBAC management
│   │   │   ├── students/             # Student management
│   │   │   ├── teachers/             # Teacher management
│   │   │   ├── classes/              # Class management
│   │   │   └── admissions/           # Admissions process
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # NextAuth endpoints
│   │   │   └── proxy/                # API proxy
│   │   └── auth/                     # Authentication pages
│   ├── components/                   # React components
│   │   ├── SystemAdmin/              # System admin components
│   │   ├── Agency/                   # Agency admin components
│   │   ├── Students/                 # Student management
│   │   ├── Teachers/                 # Teacher management
│   │   ├── Dashboard/                # Dashboard components
│   │   └── UIKit/                    # Reusable UI components
│   ├── lib/                          # Utilities and helpers
│   │   ├── connector.ts              # API client
│   │   ├── rbac.ts                   # RBAC utilities
│   │   └── actions.ts                # Server actions
│   ├── middleware.ts                 # Route protection
│   ├── auth.ts                       # NextAuth configuration
│   └── types/                        # TypeScript types
├── public/                           # Static assets
├── k8s/                              # Kubernetes configurations
└── docs/                              # Documentation
```

## Key Features & Components

### Authentication Flow

1. User logs in via email/phone and password
2. NextAuth validates credentials with backend API
3. Session is created with user role and permissions
4. Middleware redirects based on user role:
   - System Admin → `/system-admin/dashboard`
   - Agency Admin → `/agency/dashboard`
   - Tenant Admin → `/dashboard`

### Multi-Tenant Routing

The application uses domain-based tenant routing:
- Each tenant has a unique domain (e.g., `schoola.lepa.cc`)
- The `NEXT_PUBLIC_LEPA_HOST_HEADER` environment variable sets the tenant context
- API requests include tenant context via headers

### RBAC System

**Roles**: Collections of permissions (e.g., "Admin", "Teacher", "Student")
**Permissions**: Granular access controls with:
- Resource (e.g., "students", "teachers")
- Action (e.g., "create", "read", "update", "delete")
- Code (unique identifier)

**Features**:
- Create custom roles and permissions
- Assign permissions to roles
- Assign roles to users
- View inherited permissions per user

### Component Highlights

- **UserModal**: Create users with role assignment and type restrictions
- **TenantModal**: Create tenants with agency assignment
- **RolePermissionManagementModal**: Manage role permissions
- **UserAccessManagementModal**: Manage user roles and view permissions
- **StudentTable**: Advanced filtering, sorting, and pagination
- **Dashboard Components**: Role-specific analytics and statistics

## API Integration

The application uses a centralized API client (`src/lib/connector.ts`) that:

- Handles authentication tokens
- Manages tenant context via headers
- Provides typed API responses
- Handles errors consistently

### API Endpoints

Key endpoints used:
- `/auth/login` - User authentication
- `/users` - User management
- `/tenants` - Tenant management
- `/agencies` - Agency management
- `/rbac/roles` - Role management
- `/rbac/permissions` - Permission management
- `/students` - Student management
- `/teachers` - Teacher management
- `/classes` - Class management
- `/analytics/system` - System analytics
- `/analytics/agency` - Agency analytics

## Deployment

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

```bash
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
AUTH_TRUST_HOST=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.production.lepa.cc
NEXT_PUBLIC_LEPA_HOST_HEADER=your-tenant-domain.lepa.cc
```

### Kubernetes Deployment

The project includes Kubernetes configurations in the `k8s/` directory:

- Base configurations in `k8s/base/`
- Environment-specific overlays (dev, staging, production)
- ConfigMaps for environment variables
- Ingress configurations

### Docker

A `Dockerfile` is included for containerized deployments.

### Build & Deploy

```bash
# Build the application
yarn build

# The build output will be in .next/
# Deploy according to your hosting platform's requirements
```

## Security Considerations

- **Authentication**: NextAuth with secure session management
- **Authorization**: Middleware-based route protection
- **RBAC**: Granular permission system
- **Input Validation**: Zod schemas for form validation
- **API Security**: Token-based authentication with tenant context
- **Password Handling**: Secure password fields with autocomplete prevention

## Browser Autofill Prevention

The application includes measures to prevent browser autofill on sensitive forms:
- Email fields: `autoComplete="off"`
- Password fields: `autoComplete="new-password"`
- Unique field names and IDs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**LEPA Frontend** - Empowering education through technology 🎓

**Built with ❤️ by the Nexlura team**

*© 2026 Nexlura LLC. All rights reserved.*
