# MENU 2.0 - Production Deployment Guide

## Overview
MENU 2.0 is a luxury digital menu system built with Next.js, Tailwind CSS, and Supabase.

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Quick Start

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd MENU2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `ENV_EXAMPLE.txt` content to `.env.local`
   - Update with your Supabase credentials if needed

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── admin/        # Admin dashboard
│   ├── stores/       # Store selection and menus
│   └── api/          # API routes
├── components/       # React components
│   ├── admin/        # Admin-specific components
│   └── ui/           # Reusable UI components
├── lib/              # Utilities and configurations
│   ├── constants.ts  # App constants
│   ├── utils.ts      # Helper functions
│   └── supabase.ts   # Database client
└── types/            # TypeScript definitions
```

## Key Features

- **Live Menu Display**: Real-time product updates every 60 seconds
- **Multi-Store Support**: CLT, SAL, TN, BR stores
- **Product Categories**: Flower, Vape, Edible, Concentrate, Moonwater
- **Admin Dashboard**: Full CRUD operations for stores and products
- **Bulk Upload**: CSV import for multiple products
- **Luxury UI**: Premium design with smooth animations

## Admin Access

Navigate to `/admin` to access:
- Store Management
- Product Management  
- Bulk Upload (CSV)

## Database Schema

### Products Table
- `id` (UUID)
- `product_name` (text)
- `product_category` (text)
- `strain_type` (text)
- `strain_cross` (text)
- `description` (text)
- `terpene` (text)
- `strength` (text)
- `thca_percent` (numeric)
- `delta9_percent` (numeric)
- `store_code` (text)

### Store Table
- `id` (UUID)
- `code` (text)
- `name` (text)
- `address` (text)

## Deployment Options

### Vercel (Recommended)
```bash
npx vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Performance Optimizations

- Server-side rendering for SEO
- Automatic code splitting
- Image optimization
- Tailwind CSS purging
- Component lazy loading

## Maintenance

- **Clear Store Cache**: Happens automatically after updates
- **Database Backup**: Use Supabase dashboard
- **Logs**: Check Vercel/hosting platform logs

## Support

For technical issues:
1. Check browser console for errors
2. Verify Supabase connection
3. Ensure environment variables are set
4. Check network requests in DevTools

## Security Notes

- Never commit `.env.local` file
- Use environment variables for all secrets
- Enable RLS policies in Supabase
- Regular dependency updates

---

Last Updated: January 2024
Version: 1.0.0 