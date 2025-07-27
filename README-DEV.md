# Living Portfolio - Development Branch

This branch is configured to run in development mode on EasyPanel without requiring a build step.

## Key Differences from Production Branch

- **No Build Step**: Runs `pnpm dev` instead of `pnpm build && pnpm start`
- **Development Mode**: `NODE_ENV=development`
- **Hot Reload**: Code changes are reflected immediately
- **All Dependencies**: Includes dev dependencies for development tools

## EasyPanel Deployment

1. Create a new service in EasyPanel
2. Set source to: `https://github.com/bashhh89/theportfoliowithai`
3. Set branch to: `easypanel-dev`
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MISTRAL_API_KEY`
5. Deploy

## Benefits

- **Faster Deployment**: No build step means faster container startup
- **Development Features**: Access to Next.js dev tools and hot reload
- **Easier Debugging**: Better error messages and stack traces
- **No Build Failures**: Bypasses any compilation issues

## Considerations

- **Performance**: Development mode is slower than production
- **Security**: Development mode exposes more information
- **Resource Usage**: Uses more memory and CPU than production build

## When to Use

- Quick testing and prototyping
- When production build is failing
- Development and debugging
- Rapid iteration and changes

For production deployments, use the `easypanel-ready` branch instead.