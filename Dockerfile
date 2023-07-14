FROM node:18.12.1 AS builder
ENV NODE_ENV production
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json package-lock.json ./
RUN npm ci
# Copy app files
COPY . .
# Build the app
RUN npm build

# Bundle static assets with nginx
FROM nginx:1.21.0 as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
