# WSL Commands Cheat Sheet for Next.js Development

## Navigation Commands

```bash
# See current directory
pwd

# List files and folders
ls
ls -la  # Show all files with details

# Change directory to your project
cd /mnt/e/myportfio/living-portfolio

# Go up one directory
cd ..

# Go to home directory
cd ~
```

## Project Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Install a new package
pnpm add package-name

# Install a dev dependency
pnpm add -D package-name
```

## File Operations

```bash
# Create a new file
touch filename.js

# Create a new directory
mkdir directory-name

# Remove a file
rm filename.js

# Remove a directory
rm -rf directory-name

# Copy a file
cp source.js destination.js

# Move/rename a file
mv oldname.js newname.js
```

## Git Commands (Same in WSL)

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Your message"

# Push to remote
git push
```

## Tips for WSL

1. Windows drives are mounted at `/mnt/` (e.g., `/mnt/c/`, `/mnt/e/`)
2. Use Tab for auto-completion of commands and paths
3. Copy/paste with right-click or Ctrl+Shift+C/V
4. Use VS Code's file explorer alongside the terminal
5. If you get permission errors, try `sudo` before commands