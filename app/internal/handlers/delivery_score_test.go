package handlers

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"carbon_driver_app/internal/accessdb" // Adjust the import path accordingly
)


func setupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	r.POST("/api/v1/deliveries/:uuid/scores", func(c *gin.Context) {
		PostDeliveryScores(c, db)
	})
	return r
}

func TestPostDeliveryScores(t *testing.T) {
	// Setup in-memory SQLite database for testing
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}

	// Migrate the database schema
	db.AutoMigrate(&accessdb.User{}, &accessdb.DeliveryScore{}) // Adjust as per your models

	// Create a test user
	testUser := accessdb.User{
		UID:     "test-uuid",
		Name:    "Test User",
		Email:   "test@example.com",
		Password: "password", // Use hashed password in production
	}
	db.Create(&testUser)

	// Setup the router
	router := setupRouter(db)

	// Load test data from JSON file
	file, err := os.Open("test_data.json") // Adjust the path if necessary
	if err != nil {
		t.Fatalf("failed to open test data file: %v", err)
	}
	defer file.Close()

	data, err := ioutil.ReadAll(file)
	if err != nil {
		t.Fatalf("failed to read test data file: %v", err)
	}

	// Create a request
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/deliveries/test-uuid/scores", bytes.NewBufferString(testData))
	req.Header.Set("Content-Type", "application/json")

	// Record the response
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusCreated, w.Code)

	// Log the response body
	var response map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &response); err == nil {
		if score, exists := response["score"]; exists {
			log.Printf("Score: %v", score)
		} else {
			log.Println("Score not found in response")
		}
	} else {
		log.Printf("Error parsing response: %v", err)
	}

	assert.Contains(t, w.Body.String(), `"score":`) // Check if score is returned in the response
}

