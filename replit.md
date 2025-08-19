# TaskMaster - Task Management Application

## Overview

TaskMaster is a full-stack task management application built with React and Express. It provides a clean, modern interface for creating, organizing, and tracking personal and work tasks. The application features a categorization system, priority levels, due date tracking, and real-time status updates with a focus on user productivity and organization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful API with standardized error handling and request/response patterns
- **Validation**: Zod schemas shared between client and server for consistent data validation
- **Database Layer**: Drizzle ORM for type-safe database operations and migrations
- **Storage**: Configurable storage interface with in-memory implementation for development

### Data Storage Solutions
- **Database**: PostgreSQL as the primary database (configured via Drizzle)
- **ORM**: Drizzle ORM with schema-first approach and automatic type generation
- **Migrations**: Drizzle Kit for database schema management and versioning
- **Connection**: Neon Database serverless PostgreSQL driver for cloud deployment

### Authentication and Authorization
- Currently implemented with basic session handling (connect-pg-simple for session storage)
- No user authentication system implemented yet - designed for single-user or extension to multi-user

### Task Management Features
- **Task Categories**: Predefined categories (work, personal, shopping, fitness) with color coding
- **Priority System**: Boolean priority flag for highlighting important tasks
- **Due Date Tracking**: Date-based organization with overdue detection
- **Status Management**: Completion tracking with timestamps
- **Filtering & Views**: Multiple view modes (all, today, week) and category-based filtering
- **Search Functionality**: Real-time search across task titles

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Zod integration for form validation
- **wouter**: Lightweight routing library

### Database & Backend
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Automatic Zod schema generation from Drizzle schemas
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store for Express

### UI & Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **lucide-react**: Modern icon library

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

### Utilities
- **date-fns**: Date manipulation and formatting
- **zod**: Schema validation library
- **clsx**: Conditional className utility
- **nanoid**: Unique ID generation