# Living Portfolio with AI

A modern, AI-powered portfolio website featuring interactive chat, lead generation, and dynamic content management.

## Features

- **AI Chat Widget**: Interactive AI assistant powered by Mistral AI
- **Lead Generation**: Automated lead qualification and notification system
- **Dynamic Content**: AI-powered content generation and management
- **Responsive Design**: Mobile-first, modern UI with smooth animations
- **Admin Dashboard**: Content management and analytics interface
- **Real-time Analytics**: Built-in tracking and visitor insights
- **Supabase Integration**: Secure database and authentication

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **AI**: Mistral AI for chat and content generation
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Docker, EasyPanel ready

## Quick Start

### Development

1. Clone the repository:
```bash
git clone https://github.com/bashhh89/theportfoliowithai.git
cd theportfoliowithai
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Deployment

### EasyPanel Deployment (Recommended)

This project is optimized for EasyPanel deployment. See [EASYPANEL_DEPLOYMENT.md](./EASYPANEL_DEPLOYMENT.md) for detailed instructions.

### Docker Deployment

```bash
# Build the image
docker build -t living-portfolio .

# Run the container
docker run -p 3000:3000 --env-file .env living-portfolio
```

### Docker Compose

```bash
docker-compose up -d
```

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `MISTRAL_API_KEY` - Your Mistral AI API key

Optional:
- `NEXT_PUBLIC_APP_URL` - Your app's public URL
- `NODE_ENV` - Environment (development/production)

## Database Setup

1. Create a Supabase project
2. Run the SQL migrations from `SUPABASE_SCHEMA.sql` and `SUPABASE_MIGRATION.sql`
3. Configure your environment variables

## API Endpoints

- `/api/chat` - AI chat functionality
- `/api/analyze-website` - Website analysis
- `/api/notify-lead` - Lead notification system
- `/api/health` - Health check endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub or contact support.
