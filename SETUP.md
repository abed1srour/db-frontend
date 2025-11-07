# Setup Guide - Smart Inventory System Frontend

This guide will help you set up and run the Smart Inventory System frontend application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm/yarn/pnpm**: Package manager (npm comes with Node.js)
  - Verify npm: `npm --version`

- **Backend API**: The backend server must be running
  - See backend repository for setup instructions

## Step-by-Step Setup

### 1. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including:
- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Windows (PowerShell)
New-Item .env.local

# macOS/Linux
touch .env.local
```

Add the following content to `.env.local`:

```env
# Backend API URL - Update this with your actual backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Important Notes:**
- Replace `http://localhost:8000/api` with your actual backend URL
- If your backend runs on a different port, update the port number
- For production deployment, use your production backend URL

### 3. Start the Development Server

Run the development server:

```bash
npm run dev
```

You should see output similar to:

```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
- ready started server on [::]:3000
```

### 4. Open the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

You should see the Smart Inventory System interface.

## Verify Setup

To verify everything is working correctly:

1. **Check Frontend Loads**: You should see the "Smart Inventory System" header with two tabs (Add Product and Inventory)

2. **Test Backend Connection**: 
   - Switch to the "Inventory" tab
   - If products load (or you see an empty state), the backend connection is working
   - If you see an error, check your backend server and `.env.local` configuration

3. **Test Image Upload**:
   - Switch to "Add Product" tab
   - Try uploading an image (drag-and-drop or click to browse)
   - You should see a preview of the image

## Common Issues and Solutions

### Issue: "Failed to fetch" or Network Errors

**Possible Causes:**
- Backend server is not running
- Wrong API URL in `.env.local`
- CORS not configured in backend

**Solutions:**
1. Ensure backend server is running
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check backend CORS settings allow requests from `http://localhost:3000`
4. Check browser console (F12) for detailed error messages

### Issue: Port 3000 Already in Use

**Solution:**
Run on a different port:

```bash
# Windows (PowerShell)
$env:PORT=3001; npm run dev

# macOS/Linux
PORT=3001 npm run dev
```

### Issue: TypeScript Errors

**Solution:**
Ensure you have the latest dependencies:

```bash
npm install
```

If errors persist, try deleting node_modules and reinstalling:

```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules
npm install

# macOS/Linux
rm -rf node_modules
npm install
```

### Issue: Styling Not Appearing

**Solution:**
Ensure Tailwind CSS is properly configured. Restart the dev server:

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

## Development Workflow

### Hot Reload

The development server supports hot reload. When you edit files, changes appear automatically in the browser without page refresh.

### File Structure

Key files you might want to modify:

```
app/
├── page.tsx              # Main application logic and workflow
├── layout.tsx            # Global layout and metadata
└── globals.css           # Global styles and Tailwind config

components/
├── ui/                   # Reusable UI components
├── ImageUpload.tsx       # Image upload component
├── InventoryDashboard.tsx # Inventory list view
└── ...                   # Other feature components

lib/
└── api.ts                # API integration functions

types/
└── product.ts            # TypeScript type definitions
```

### Making Changes

1. **Modify UI Components**: Edit files in `components/`
2. **Update API Calls**: Modify `lib/api.ts`
3. **Change Workflow**: Update `app/page.tsx`
4. **Adjust Styling**: Edit component files or `app/globals.css`

## Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next/` folder.

### Run Production Build Locally

```bash
npm start
```

This starts the production server on `http://localhost:3000`

### Production Checklist

Before deploying to production:

- [ ] Update `NEXT_PUBLIC_API_URL` in `.env.local` with production backend URL
- [ ] Test all features work with production backend
- [ ] Run `npm run build` successfully
- [ ] Verify no console errors in production build
- [ ] Test on multiple browsers and devices
- [ ] Ensure backend CORS allows your production domain

## Deployment Options

### Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable `NEXT_PUBLIC_API_URL`
4. Deploy

### Other Platforms

- **Netlify**: Similar to Vercel
- **AWS Amplify**: Use AWS hosting
- **Docker**: Create Dockerfile for containerization
- **Traditional Hosting**: Build locally and upload `.next/` folder

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes | `http://localhost:8000/api` |

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Testing the Application

### Manual Testing Checklist

- [ ] Upload image successfully
- [ ] Classification returns results
- [ ] Manual classification works
- [ ] Price prediction displays
- [ ] Price can be edited
- [ ] Quantity can be adjusted
- [ ] Product adds to inventory
- [ ] Existing product detection works
- [ ] Inventory dashboard loads
- [ ] Search functionality works
- [ ] Filter by type works
- [ ] Edit product works
- [ ] Delete product works

### Test with Sample Data

1. Prepare sample product images
2. Go through add product workflow
3. Verify products appear in inventory
4. Test edit and delete operations
5. Test search and filter

## Performance Tips

### Optimize Images

- Use appropriate image sizes
- Consider image compression before upload
- Backend should handle image optimization

### Large Inventories

- Currently all products load at once
- For 1000+ products, consider implementing:
  - Pagination
  - Virtual scrolling
  - Server-side search and filter

## Getting Help

If you encounter issues:

1. **Check the README**: See `README.md` for features and usage
2. **Browser Console**: Press F12 and check Console tab for errors
3. **Network Tab**: Check if API calls are succeeding
4. **Backend Logs**: Check backend server logs
5. **Environment Variables**: Verify `.env.local` is correct

## Next Steps

After setup is complete:

1. **Connect to Backend**: Ensure backend API is properly configured
2. **Test Workflow**: Go through the complete product addition workflow
3. **Customize**: Adjust styling, currency, or features as needed
4. **Deploy**: Follow deployment guide when ready for production

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Project**: Smart Inventory System  
**Course**: Multimedia Database and Image Processing  
**Year**: Fall 2025/2026

