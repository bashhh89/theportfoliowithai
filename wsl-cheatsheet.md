# WSL Command Cheat Sheet

## 🧭 Navigation Commands

| Command | Description | Example |
|---------|-------------|---------|
| `pwd` | Show current directory | `pwd` → `/mnt/e/myportfio/living-portfolio` |
| `ls` | List files and folders | `ls` |
| `ls -la` | List all files with details | `ls -la` |
| `cd /path` | Change directory | `cd /mnt/e/myportfio/living-portfolio` |
| `cd ..` | Go up one directory | `cd ..` |
| `cd ~` | Go to home directory | `cd ~` |

## 📁 File Operations

| Command | Description | Example |
|---------|-------------|---------|
| `mkdir folder-name` | Create directory | `mkdir components` |
| `touch file.js` | Create empty file | `touch api.js` |
| `cp file1 file2` | Copy file | `cp .env.example .env` |
| `mv old-name new-name` | Rename/move file | `mv temp.js final.js` |
| `rm file.txt` | Delete file | `rm unused.js` |
| `rm -rf folder` | Delete folder and contents | `rm -rf .next` |

## 📦 Package Management

| Command | Description | Example |
|---------|-------------|---------|
| `pnpm dev` | Run development server | `pnpm dev` |
| `pnpm install` | Install dependencies | `pnpm install` |
| `pnpm add package` | Add new package | `pnpm add axios` |
| `pnpm build` | Build for production | `pnpm build` |
| `pnpm start` | Start production server | `pnpm start` |

## 🔄 Git Commands

| Command | Description | Example |
|---------|-------------|---------|
| `git status` | Check status | `git status` |
| `git add .` | Stage all changes | `git add .` |
| `git commit -m "message"` | Commit changes | `git commit -m "Fix hydration error"` |
| `git pull` | Pull latest changes | `git pull` |
| `git push` | Push commits | `git push` |

## 🔧 Environment Variables

| Command | Description | Example |
|---------|-------------|---------|
| `export VAR=value` | Set environment variable | `export MISTRAL_API_KEY=ajrXjgkAaNFq0rTqgVQ88xOVj5veH5uj` |
| `echo $VAR` | Print variable value | `echo $MISTRAL_API_KEY` |
| `env` | List all environment variables | `env` |

## 🚀 Quick Project Commands

| Command | Description |
|---------|-------------|
| `cd /mnt/e/myportfio/living-portfolio && pnpm dev` | Navigate to project and start dev server |
| `cd /mnt/e/myportfio/living-portfolio && pnpm build` | Build project for production |
| `cd /mnt/e/myportfio/living-portfolio && pnpm lint` | Run linter |

## 💡 Tips & Tricks

- Press `Tab` to autocomplete commands and paths
- Use `Ctrl+C` to stop running processes
- Use `clear` to clear the terminal screen
- Use `history` to see previously used commands
- Add `&` at the end of a command to run it in the background