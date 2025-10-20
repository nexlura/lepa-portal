# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build # This generates the .next/standalone output

# Stage 2: Create the production-ready image using Distroless
FROM gcr.io/distroless/nodejs20

WORKDIR /app

# Copy only the necessary files for production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/locales ./locales

# Set environment variables for Next.js
ENV NODE_ENV=production

# Expose the port Next.js listens on
EXPOSE 3000

# Start the Next.js server
CMD ["server.js"]