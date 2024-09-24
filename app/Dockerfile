# Use the official Golang image as a base for building the app
FROM golang:1.23-alpine AS build

# Install required dependencies
RUN apk add --no-cache git

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files to the container
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the entire project directory (including internal/ and cmd/)
COPY . .

# Build the Go application targeting the cmd/carbon_driver_app directory
RUN go build -o main ./cmd/carbon_driver_app

# Use a minimal alpine image for the final container
FROM alpine:latest

# Install ca-certificates and curl for health checks
RUN apk --no-cache add ca-certificates curl

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
