# Dockerfile

# Base image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Install dependencies for node-gyp (Python and build tools)
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

# Copy the dependencies files and install dependencies
COPY package.json ./
RUN bun install

# Copy the rest of the project files
COPY . .

# Build the Next.js app
RUN bun next build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["bun", "next", "start"]
