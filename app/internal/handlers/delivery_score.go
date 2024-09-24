package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"github.com/google/uuid"
	"carbon_driver_app/internal/accessdb"
	"time"
	"math"
)

// Constants for score thresholds
const (
	initialScore			= 100
	accelerationThreshold	= 5.0  // Replace with appropriate value for sudden stops/accelerations
	// orientationThreshold = 10.0 // Replace with appropriate value for orientation changes
)

// generateUniqueID generates a new unique ID
func generateUniqueID() string {
	return uuid.NewString() // Generate a new UUID as a string
}

// DeliveryData represents the incoming delivery data
type DeliveryData struct {
	Motions      []MotionWrapper      `json:"motions"`        // Array of MotionWrapper objects
	Orientations []OrientationWrapper `json:"orientations"`   // Array of OrientationWrapper objects
}

// MotionWrapper wraps the motion object to match the incoming JSON format
type MotionWrapper struct {
	Motion Motion `json:"motion"` // Motion object inside each array element
}

// OrientationWrapper wraps the orientation object to match the incoming JSON format
type OrientationWrapper struct {
	Orientation Orientation `json:"orientation"` // Orientation object inside each array element
}

type float = float64

type Motion struct {
	X float `json:"x"`
	Y float `json:"y"`
	Z float `json:"z"`
}

type Orientation struct {
	Alpha float `json:"alpha"`
	Beta  float `json:"beta"`
	Gamma float `json:"gamma"`
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

// CalculateDeliveryScore calculates the score based on motion data
func CalculateDeliveryScore(motions []Motion, orientations []Orientation) int {
	score := initialScore

	for _, motion := range motions {
		// Calculate the magnitude of acceleration vector
		accelerationMagnitude := math.Sqrt(motion.X*motion.X + motion.Y*motion.Y + motion.Z*motion.Z)

		// Check if the acceleration exceeds the threshold
		if accelerationMagnitude > accelerationThreshold {
			score -= 10 // Decrease score if acceleration exceeds the threshold
		}
	}

	// Optionally, include logic for orientation checks here
	_ = orientations

	return score
}
