package main

import (
	"log"
	"os"
	"carbon_driver_app/internal/accessdb"
	"carbon_driver_app/internal/handlers"
	"carbon_driver_app/internal/loadconfig"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration (from loadconfig)
	config, err := loadconfig.LoadConfig()
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	// Initialize database connection
	db, err := accessdb.InitDB(config)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run migrations for users and delivery_scores
	err = accessdb.RunMigrations(db)
	if err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	if os.Getenv("DB_SEED") == "true" {
		accessdb.SeedData(db)
	}

	// Initialize Gin router
	router := gin.Default()

	// Set up routes (from handlers)
	handlers.SetupRoutes(router, db)

	// Start the server on port 8000
	router.Run(":8000")
}
