# Spy Cat Agency - Frontend

Next.js frontend for the Spy Cat Agency management system.

## Features

- Modern React with Next.js 14 App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design
- Real-time API integration
- Error handling and loading states

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `app/` - Next.js 14 app directory structure
- `components/` - Reusable React components
- `lib/` - Utility functions and API client
- `types/` - TypeScript type definitions

## Styling

Uses Tailwind CSS with custom utility classes defined in `globals.css`:

- `.btn` - Base button styles
- `.btn-primary` - Primary button variant
- `.btn-secondary` - Secondary button variant
- `.btn-danger` - Danger button variant
- `.form-input` - Form input styles
- `.form-label` - Form label styles
- `.card` - Card container styles

## API Integration

The frontend communicates with the FastAPI backend through:

- `lib/api.ts` - API client with axios
- `lib/utils.ts` - Error handling utilities
- Automatic error handling and user feedback

## Environment Variables

None required for development. Backend URL is configured in `next.config.js`.

## Production Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

For production, update the API base URL in `lib/api.ts` or use environment variables.
