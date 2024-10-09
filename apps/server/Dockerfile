# Stage 1: Build dependencies and application
# FROM node:18 AS builder

# # Set the working directory in the container
# WORKDIR /app

# # Copy the entire monorepo (make sure .dockerignore excludes unnecessary files)
# COPY . .

# WORKDIR /app

# RUN ls -la /app

# # Install dependencies and link local packages
# RUN npm install

# # Build the backend application
# RUN npm run build

# FROM node:18-alpine

# WORKDIR /app

# COPY --from=builder /app/packages /app/packages

# # Copy the built backend application from the builder stage
# COPY --from=builder /app/apps/server /app/apps/server

# # Copy node_modules to include local packages and dependencies
# COPY --from=builder /app/node_modules /app/node_modules

# WORKDIR /app/apps/server

# EXPOSE 3000

# CMD ["npm", "run", "dev"]

# Stage 1: Build dependencies and application
FROM node:18 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the entire monorepo (make sure .dockerignore excludes unnecessary files)
COPY packages/prisma /app/packages/prisma
COPY apps/server /app/apps/server
COPY turbo.json /app/

COPY package.json package-lock.json /app/

RUN npm install

WORKDIR /app

RUN ls -la /app

# Install dependencies and link local packages
# RUN npm install

# Build the backend application
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/packages /app/packages

# Copy the built backend application from the builder stage
COPY --from=builder /app/apps/server /app/apps/server

# Copy node_modules to include local packages and dependencies
COPY --from=builder /app/node_modules /app/node_modules

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["npm", "run", "dev"]