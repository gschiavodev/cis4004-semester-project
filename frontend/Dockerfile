# Use an official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /frontend

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies inside the container
RUN npm install

# Expose Vite's default port
EXPOSE 5173

# Start the app with a script that checks for dependencies
CMD ["sh", "-c", "npm install && npm run dev -- --host"]