package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func SetupRoutes(router *gin.Engine) {
	router.GET("/helloworld", HelloWorldHandler)
}

func HelloWorldHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello, world!",
	})
}
