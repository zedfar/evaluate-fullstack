# Dev Web Products

A modern full-stack web application built with React 19, TypeScript, and Vite, featuring product management functionality with a comprehensive development setup.

## Features

- Modern React 19 with TypeScript
- Fast development with Vite (Rolldown)
- Responsive UI with TailwindCSS
- Type-safe API calls with Axios
- Efficient state management with Zustand
- Server state management with TanStack Query
- Client-side routing with React Router DOM
- Form handling with React Hook Form
- Toast notifications with React Hot Toast
- Beautiful icons with Lucide React
- Multi-environment support (development, staging, production)

## Tech Stack

### Frontend
- **React** 19.1.0 - UI library
- **TypeScript** - Type safety
- **Vite** (Rolldown) - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Global state management
- **React Hook Form** - Form validation and handling
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web-fullstack-initial
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.development
```

Edit `.env.development` with your configuration. See [Environment Setup](./docs/ENVIRONMENT_SETUP.md) for detailed instructions.

## Available Scripts

### Development
```bash
npm run dev                 # Start development server (uses production mode)
```

### Build
```bash
npm run build              # Build for production
npm run build:staging      # Build for staging environment
npm run build:production   # Build for production environment
```

### Preview
```bash
npm run preview            # Preview production build locally
npm run preview:staging    # Preview staging build locally
```

### Linting
```bash
npm run lint              # Run ESLint on the codebase
```

## Project Structure

```
web-fullstack-initial/
├── docs/                    # Documentation files
│   ├── API_TROUBLESHOOTING.md
│   └── ENVIRONMENT_SETUP.md
├── public/                  # Static assets
├── server/                  # Backend server files
│   └── db.json             # Mock database
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── routes/             # Routing configuration
│   ├── services/           # API services
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Root application component
│   └── main.tsx            # Application entry point
├── .env.example            # Environment variables template
├── .env.development        # Development environment config
├── .env.staging            # Staging environment config
├── .env.production         # Production environment config
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Environment Configuration

The application supports multiple environments with separate configuration files:

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

All environment variables must be prefixed with `VITE_` to be accessible in the client-side code.

### Key Environment Variables

```bash
VITE_APP_NAME=Dev Web Products
VITE_API_BASE_URL=http://localhost:8000
VITE_MOCK_API=false
```

For detailed environment setup instructions, see [ENVIRONMENT_SETUP.md](./docs/ENVIRONMENT_SETUP.md).

## Documentation

- [Environment Setup Guide](./docs/ENVIRONMENT_SETUP.md) - Detailed environment configuration instructions
- [API Troubleshooting](./docs/API_TROUBLESHOOTING.md) - Common API issues and solutions

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Leverage TypeScript for type safety
- Follow ESLint and Prettier configurations

### State Management
- Use **Zustand** for global client state
- Use **TanStack Query** for server state and caching
- Keep component state local when possible

### Component Organization
- Place reusable components in `src/components/`
- Place page components in `src/pages/`
- Co-locate component-specific styles and tests

### API Integration
- Define API services in `src/services/`
- Use Axios for HTTP requests
- Handle errors with toast notifications
- Leverage TanStack Query for caching and refetching

## Troubleshooting

If you encounter API-related issues, refer to the [API Troubleshooting Guide](./docs/API_TROUBLESHOOTING.md).

## License

This project is private and proprietary.
