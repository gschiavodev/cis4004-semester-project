# Use an official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /frontend

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev", "--", "--host"]
