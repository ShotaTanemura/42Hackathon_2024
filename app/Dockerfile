# Use the official Golang image as a base
FROM golang:1.23-alpine AS build

# Install required dependencies
RUN apk add --no-cache git

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the entire app directory to the container
COPY . .

# Build the Go application
RUN go build -o main .

# Use a minimal alpine image for the final container
FROM alpine:latest

# Install ca-certificates to ensure https support
RUN apk --no-cache add ca-certificates

# Set the working directory inside the final container
WORKDIR /root/

# Copy the compiled binary from the build stage
COPY --from=build /app/main .

# Copy configuration files, if any (optional)
# COPY config.yaml ./

# Expose the port on which the app will run
EXPOSE 8000

# Set environment variables for database connection
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=goapp

# Start the Go application
CMD ["./main"]
