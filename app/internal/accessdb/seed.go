package accessdb

import (
	"log"
	"gorm.io/gorm"
	"time"
)

// Define static UUIDs for seeding
const (
	staticUser1UUID  = "123e4567-e89b-12d3-a456-426614174000"
	staticUser2UUID  = "123e4567-e89b-12d3-a456-426614174001"
	staticScore1UUID = "123e4567-e89b-12d3-a456-426614174100"
	staticScore2UUID = "123e4567-e89b-12d3-a456-426614174101"
)

// SeedData seeds the database with mock data using static UUIDs for prototyping, if it's empty
func SeedData(db *gorm.DB) {
	// Check if there are any existing users
	var userCount int64
	if err := db.Model(&User{}).Count(&userCount).Error; err != nil {
		log.Fatalf("Failed to check user count: %v", err)
		return
	}

	// If the user count is greater than 0, skip seeding
	if userCount > 0 {
		log.Println("Database already contains users, skipping seeding.")
		return
	}

	log.Println("No users found, proceeding with seeding...")

	// Create mock users with static UUIDs
	users := []User{
		{
			UID:          staticUser1UUID,
			Name:         "John Doe",
			Email:        "john@example.com",
			Password: "password123", // Hash in production!
		},
		{
			UID:          staticUser2UUID,
			Name:         "Jane Smith",
			Email:        "jane@example.com",
			Password: "password123", // Hash in production!
		},
	}

	// Insert users into the database
	for _, user := range users {
		if err := db.Create(&user).Error; err != nil {
			log.Printf("Error seeding user %s: %v", user.Name, err)
		} else {
			log.Printf("Seeded user %s", user.Name)
		}
	}

	// Create mock delivery scores with static UUIDs
	deliveryScores := []DeliveryScore{
		{
			UID:       staticScore1UUID,
			UserID:    staticUser1UUID, // Associate with user 1
			Score:     95,
			CreatedAt: time.Now().Format(time.RFC3339),
			UpdatedAt: time.Now().Format(time.RFC3339),
		},
		{
			UID:       staticScore2UUID,
			UserID:    staticUser2UUID, // Associate with user 2
			Score:     90,
			CreatedAt: time.Now().Format(time.RFC3339),
			UpdatedAt: time.Now().Format(time.RFC3339),
		},
	}

	// Insert delivery scores into the database
	for _, score := range deliveryScores {
		if err := db.Create(&score).Error; err != nil {
			log.Printf("Error seeding delivery score for user %s: %v", score.UserID, err)
		} else {
			log.Printf("Seeded delivery score for user %s", score.UserID)
		}
	}
}
