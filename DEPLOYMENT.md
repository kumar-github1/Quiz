# Deployment Guide

## Deploying to Vercel (Frontend)

### Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Have your backend deployed and accessible via URL

### Steps

1. **Deploy Backend First**
   - Deploy your Express.js backend to a platform like:
     - Railway (recommended)
     - Render
     - Heroku
     - DigitalOcean App Platform

2. **Configure Environment Variables**
   - In your Vercel dashboard, add the following environment variable:
     - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.railway.app/api`)

3. **Deploy to Vercel**
   ```bash
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   
   # Follow the prompts:
   # - Set up and deploy: Yes
   # - Which scope: Select your account
   # - Link to existing project: No
   # - Project name: quiz-app-frontend (or your preferred name)
   # - Directory: ./ (root directory)
   # - Override settings: No
   ```

4. **Configure Build Settings**
   - Vercel will automatically detect this is a React app
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm install && cd client && npm install`

### Alternative: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the build settings as above
6. Add environment variables in the Vercel dashboard

## Backend Deployment Options

### Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET`
   - `PORT`
4. Deploy

### Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
JWT_SECRET=your-jwt-secret
PORT=5000
```

## Database Setup

For production, consider using:
- PlanetScale (MySQL)
- Railway PostgreSQL
- Supabase
- AWS RDS

## Troubleshooting

1. **CORS Issues**: Ensure your backend allows requests from your Vercel domain
2. **API 404**: Check that `REACT_APP_API_URL` is correctly set
3. **Build Failures**: Ensure all dependencies are in `package.json`

## Post-Deployment

1. Test all functionality
2. Update your database with production data
3. Set up monitoring and logging
4. Configure custom domain (optional) 