FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Start the application in dev mode for local development
CMD ["pnpm", "dev"]
