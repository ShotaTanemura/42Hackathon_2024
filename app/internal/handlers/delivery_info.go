package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func PostDeliveryInfo(c *gin.Context, db *gorm.DB) {
	_ = c
	_ = db

	c.JSON(http.StatusOK, gin.H{
		"message": "Hello, world!",
	})
}