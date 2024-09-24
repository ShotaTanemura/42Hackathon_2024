package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"gorm.io/gorm"
)

// SetupRoutes sets up the routes for the application
func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	router.GET("/helloworld", GetHelloWorld)
	router.POST("/api/v1/deliveries/:uuid/scores", func(c *gin.Context) {
		PostDeliveryScores(c, db)
	}) // This function is now imported from delivery_scores.go
	router.POST("/api/v1/deliveries/:uuid", func(c *gin.Context) {
		PostDeliveryInfo(c, db)
	}) // This function is now imported from delivery_scores.go
}

// GetHelloWorld handles the GET request for a simple hello world response
func GetHelloWorld(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello, world!",
	})
}
