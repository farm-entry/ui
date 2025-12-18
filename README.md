# Farm Entry UI

A modern React-based user interface for comprehensive farm operations management. Built with React 19, Material-UI 7, and Vite 7, this application provides an intuitive interface for tracking livestock activities, equipment maintenance, fuel consumption, inventory management, and performance scorecards.

## Features

### Livestock Activity Management
- **Purchase** - Record livestock acquisitions with pricing and vendor details
- **Mortality** - Track livestock deaths with reason codes and detailed reporting
- **Grade Off** - Dynamic form generation based on event-specific reason codes
- **Quantity Adjustment** - Adjust livestock counts with full audit trail
- **Move** - Transfer livestock between locations and jobs
- **Wean** - Record weaning events with automatic calculations

### Operations Management
- **Fuel Tracking** - Monitor fuel consumption and costs for farm equipment
- **Maintenance** - Schedule and track equipment maintenance activities
- **Inventory Consumption** - Manage feed, supplies, and material usage
- **Job Header Updates** - Update job information and posting groups
- **Scorecards** - View and manage livestock performance metrics

### Technical Features
- Form state persistence with localStorage (48-hour expiry)
- Type-safe forms with React Hook Form 7.62
- Global state management with Zustand 5.0.8
- Dynamic form generation based on GraphQL schema
- Authentication with development bypass option
- Responsive Material-UI 7 design
- Real-time validation and error handling

## Prerequisites

- Node.js 18+ (LTS version recommended)
- npm or yarn package manager

## Getting Started

### Installation

Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

### Environment Variables

Create a `.env` file in the root directory with the following required variables:

```bash
# Required API endpoints
FRONTLINE_API_URL=https://frontline-farms-api-dev-118acd7155d2.herokuapp.com
FRONTLINE_NAV_API_URL=https://nav.moglerfarms.com:7148/AppTest/ODataV4/

# Optional: Skip authentication for development
FRONTLINE_SKIP_AUTH=true
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── framework/       # Core framework components (headers, loaders, notifications)
│   └── inputs/          # Form input components (TextField, DatePicker, TypeAhead)
├── layouts/             # Page layout wrappers
├── pages/               # Main application pages
│   ├── livestock-activity/  # Livestock management forms
│   ├── employees.tsx    # Employee management
│   └── index.tsx        # Dashboard
├── services/            # API communication layer
├── store/               # Zustand state management
│   ├── livestockActivityStore.ts
│   ├── postingGroupsStore.ts
│   ├── formStorageStore.ts
│   └── confirmationStore.ts
├── utils/               # Utility functions (date formatting, etc.)
└── assets/              # Static assets and images
```

## Technology Stack

- **React 19** - Latest React with improved performance
- **TypeScript 5** - Type safety and better developer experience
- **Material-UI 7** (@mui/material, @mui/icons-material, @mui/x-date-pickers)
- **React Router 7** - Client-side routing
- **React Hook Form 7.62** - Performant form validation and management
- **Zustand 5.0.8** - Lightweight state management with devtools
- **Vite 7** - Fast build tool and development server
- **@toolpad/core** - Layout and navigation components
- **date-fns** - Modern date utility library
- **Zod 3.24** - Schema validation

## Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

The build output will be in the `dist` directory. To deploy, use:
```bash
npm start
```
This serves the production build using `serve` on the PORT environment variable.

## Key Features Implementation

### Form Storage
Forms automatically save to localStorage with a 48-hour expiry. Users receive notifications to restore previous sessions when available.

### Dynamic Form Generation
The Grade Off form dynamically generates input fields based on event-specific reason codes from the GraphQL API, ensuring data consistency with the backend schema.

### TypeAhead Components
Custom TypeAhead components provide searchable dropdowns for jobs, events, and other complex data structures with proper null handling.

### State Management
Zustand stores manage:
- Livestock activity data and event types
- Posting groups and job information
- Form storage and restoration
- Global UI state (confirmations, notifications)

## Development Guidelines

- Forms use `number | null` for numeric fields (never `number | ""`)
- All livestock forms follow the same template structure
- TypeAhead clear functionality uses `v?.value ?? null` pattern
- Form data is validated against GraphQL schema types
- Use `formatDateToYYYYMMDDNoTimestamp` and `parseYYYYMMDDToLocalDate` for consistent date handling

