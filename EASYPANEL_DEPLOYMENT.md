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

### Method 1: Using EasyPanel Template (Recommended)

1. In EasyPanel, go to "Services" → "Templates"
2. Click "Add Template" and upload the `easypanel-template.json` file
3. Fill in the required environment variables
4. Deploy the service

### Method 2: Manual Docker Deployment

1. Create a new service in EasyPanel
2. Set the source to this GitHub repository: `https://github.com/bashhh89/theportfoliowithai`
3. Set the branch to `easypanel-ready`
4. Configure the environment variables
5. Set the port to 3000
6. Deploy

### Method 3: Docker Compose

1. Upload the `docker-compose.yml` file to your EasyPanel server
2. Set up environment variables in a `.env` file
3. Run: `docker-compose up -d`

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