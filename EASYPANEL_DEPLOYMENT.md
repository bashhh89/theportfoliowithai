# EasyPanel Deployment Guide

This guide will help you deploy the Living Portfolio with AI on EasyPanel.

## Prerequisites

1. EasyPanel server setup
2. Supabase project (for database and authentication)
3. Mistral AI API key (for AI chat functionality)

## Environment Variables

Set up the following environment variables in EasyPanel:

### Required Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `MISTRAL_API_KEY` - Your Mistral AI API key

### Optional Variables
- `NEXT_PUBLIC_APP_URL` - Your app's public URL (auto-set by EasyPanel)
- `NODE_ENV` - Set to "production" (auto-set)

## Deployment Methods

### Method 1: EasyPanel with Nixpacks (Recommended)

1. Create a new service in EasyPanel
2. Set the source to this GitHub repository: `https://github.com/bashhh89/theportfoliowithai`
3. Set the branch to `easypanel-ready`
4. Configure the environment variables (see below)
5. EasyPanel will automatically detect the `nixpacks.toml` configuration
6. Deploy the service

### Method 2: Using EasyPanel Template

1. In EasyPanel, go to "Services" → "Templates"
2. Click "Add Template" and upload the `easypanel-template.json` file
3. Fill in the required environment variables
4. Deploy the service

### Method 3: Docker Deployment

1. Build and deploy using the provided Dockerfile
2. Set up environment variables
3. Deploy on port 3000

### Method 4: Alternative Platforms

The project also supports deployment on:
- Railway (uses `Procfile`)
- Render
- Vercel
- Any Node.js hosting platform

## Troubleshooting

### Build Issues

If you encounter build errors:

1. **pnpm not found**: The `nixpacks.toml` file should handle this automatically
2. **Package installation fails**: Check that `pnpm-lock.yaml` is present
3. **Build timeout**: Increase build timeout in EasyPanel settings

### Runtime Issues

1. **Port binding**: Ensure the service is configured to use port 3000
2. **Environment variables**: Check all required variables are set
3. **Health check fails**: The app includes a `/api/health` endpoint for monitoring

## Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL migrations from `SUPABASE_SCHEMA.sql` and `SUPABASE_MIGRATION.sql`
3. Configure Row Level Security (RLS) policies as needed
4. Get your project URL and API keys from the Supabase dashboard

## AI Configuration

1. Sign up for Mistral AI at https://mistral.ai
2. Generate an API key
3. Add the key to your environment variables

## Features

- **AI Chat Widget**: Interactive AI assistant for visitors
- **Lead Generation**: Automated lead qualification and notification
- **Dynamic Content**: AI-powered content generation
- **Responsive Design**: Mobile-first, modern UI
- **Analytics**: Built-in tracking and insights
- **Admin Dashboard**: Content management interface

## Health Check

The application includes a health check endpoint at `/api/health` for monitoring.

## Logs

Application logs are stored in the `/app/logs` directory and mounted as a volume.

## Support

For issues or questions, please check the GitHub repository or contact support.

## Security Notes

- Always use HTTPS in production
- Keep your API keys secure and never commit them to version control
- Regularly update dependencies
- Configure proper CORS settings for your domain