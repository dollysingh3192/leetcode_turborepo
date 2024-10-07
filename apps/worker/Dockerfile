# Stage 1: Build dependencies and application
FROM node:18 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the entire monorepo (make sure .dockerignore excludes unnecessary files)
COPY . .

WORKDIR /app

RUN ls -la /app

# Install dependencies and link local packages
RUN npm install

# Build the backend application
RUN npm run build

FROM node:18-alpine

WORKDIR /app

# Copy the built backend application from the builder stage
COPY --from=builder /app/apps/worker/dist ./dist

# Copy node_modules to include local packages and dependencies
COPY --from=builder /app/apps/worker/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "dev"]