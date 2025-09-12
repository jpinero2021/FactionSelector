# Gaming Leaderboard

## Overview

A competitive gaming leaderboard application built for tracking player rankings and energy points across two factions: "Efémeros" and "Rosetta". The application features a dark gaming-themed interface inspired by League of Legends and Discord aesthetics, with faction registration, player rankings, and real-time leaderboard displays.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui for consistent design system
- **Styling**: Tailwind CSS with custom dark mode gaming theme
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

**Design System**:
- Dark-first theme with gaming aesthetics (deep charcoal backgrounds, vibrant gold accents)
- Component-based architecture with reusable UI components
- Responsive design with mobile-first approach
- Custom color palette emphasizing competitive gaming visuals

### Backend Architecture

**Framework**: Express.js with TypeScript
- **API Structure**: RESTful endpoints with `/api` prefix
- **Data Validation**: Zod schemas for type-safe data validation
- **Storage**: File-based storage with JSON persistence (registros.json)
- **Development**: Hot reload with Vite middleware integration

**Key Endpoints**:
- `GET /api/registrations` - Fetch all faction registrations
- `GET /api/registrations/:faction` - Fetch registrations by faction
- `POST /api/registrations` - Create new faction registration

### Data Storage Solutions

**Current Implementation**: File-based JSON storage
- Registration data stored in `registros.json`
- In-memory user management with Map-based storage
- Schema-driven data validation with Drizzle Zod integration

**Database Schema**: Prepared for PostgreSQL migration with Drizzle ORM
- Users table with authentication fields
- Leaderboard entries with player rankings and energy points
- Faction registration tracking

### Authentication and Authorization

**Current State**: Basic user schema defined but not implemented
- User registration and authentication endpoints prepared
- Password-based authentication structure in place
- Session management ready for implementation

### Core Features

**Leaderboard System**:
- Faction-based rankings (Efémeros vs Rosetta)
- Energy point tracking and display
- Medal system for top 3 positions (gold, silver, bronze)
- Interactive faction switching

**Registration System**:
- Faction selection (Efémeros or Rosetta)
- Player name and character UUID capture
- Form validation with toast notifications
- Real-time registration updates

**UI Components**:
- Custom rank medals with gradient styling
- Gaming-themed toggle buttons
- Responsive leaderboard table
- Modal-based registration forms

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connectivity (PostgreSQL via Neon)
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing

### UI and Styling
- **@radix-ui/react-***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional CSS class utility

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation and schema parsing

### Database and Migration
- **drizzle-kit**: Database migration and introspection tools
- **connect-pg-simple**: PostgreSQL session store for Express

### Additional Utilities
- **date-fns**: Date manipulation and formatting
- **embla-carousel-react**: Carousel component functionality
- **cmdk**: Command palette and search functionality