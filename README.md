# Farm Entry UI

This is the user interface for the Farm Entry application, built with React and Vite. The UI provides a modern interface for managing farm operations, including employee management, forms input, and dashboard views.

## Features

- Employee management and tracking
- Forms input interface for farm data
- Interactive dashboard
- Custom UI components optimized for farm data entry
- Theme customization support
- Responsive design for various screen sizes

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager
- Backend API server running (see farm-entry/api directory)

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## Project Structure

- `/src/components` - Reusable UI components
- `/src/layouts` - Page layout components
- `/src/pages` - Main application pages
- `/src/data` - Data management and state
- `/src/assets` - Static assets and images

## Development

This project uses:
- TypeScript for type safety
- Vite for fast development and building
- React for UI components
- Custom theme system for consistent styling

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## Related Projects

This UI works in conjunction with the Farm Entry backend API. Make sure to set up and run the backend server from the `farm-entry` directory for full functionality.
