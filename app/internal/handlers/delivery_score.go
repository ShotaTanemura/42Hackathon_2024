package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/google/uuid"
	"carbon_driver_app/internal/accessdb"
	"time"
)

// Constants for score thresholds
const (
	threshold          = 5.0  // Replace with appropriate value for sudden stops/accelerations
	orientationThreshold = 10.0 // Replace with appropriate value for orientation changes
)

// generateUniqueID generates a new unique ID
func generateUniqueID() string {
	return uuid.NewString() // Generate a new UUID as a string
}

// DeliveryData represents the incoming delivery data
type DeliveryData struct {
	Motions      []Motion      `json:"motions"`
	Orientations []Orientation  `json:"orientations"`
}

type Motion struct {
	X []int `json:"x"`
	Y []int `json:"y"`
	Z []int `json:"z"`
}

type Orientation struct {
	Alpha []int `json:"alpha"`
	Beta  []int `json:"beta"`
	Gamma []int `json:"gamma"`
}

// PostDeliveryScores handles the incoming delivery scores request
func PostDeliveryScores(c *gin.Context, db *gorm.DB) {
	var data DeliveryData
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Extract the UUID from the path parameters
	uuid := c.Param("uuid")

	// Retrieve the user from the database using the UUID
	var user accessdb.User
	if err := db.First(&user, "uid = ?", uuid).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Call the function to calculate the score based on motions and orientations
	score := CalculateDeliveryScore(data.Motions, data.Orientations)

	// Save the score to the database
	deliveryScore := accessdb.DeliveryScore{
		UID:       generateUniqueID(), // Implement a function to generate a unique ID for the delivery score
		UserID:    user.UID,
		CreatedAt: time.Now().Format(time.RFC3339), // Adjust according to your needs
		UpdatedAt: time.Now().Format(time.RFC3339), // Adjust according to your needs
		Score:     score,
	}

	if err := db.Create(&deliveryScore).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save delivery score"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"score": score,
	})
}

// CalculateDeliveryScore calculates the score based on motion and orientation data
func CalculateDeliveryScore(motions []Motion, orientations []Orientation) int {
	score := 100 // starting score

	// Implement logic to adjust the score based on the motion and orientation data
	for _, motion := range motions {
		for _, x := range motion.X {
			if x > threshold { // Define your threshold for abrupt movement
				score -= 10 // Deduct points for sudden stops or accelerations
			} else {
				score += 5 // Add points for smoother movements
			}
		}
	}

	// You can also consider the orientation data to adjust the score further
	for _, orientation := range orientations {
		for _, alpha := range orientation.Alpha {
			if alpha > orientationThreshold { // Define your threshold for orientations
				score -= 5 // Deduct points for abrupt orientation changes
			} else {
				score += 2 // Add points for smooth orientation
			}
		}
	}

	return score
}
