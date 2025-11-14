
# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variables
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV ADMIN_PASSWORD=1235
ENV JWT_SECRET=your-jwt-secret-change-in-production

# Start the application
CMD ["npm", "start"]
