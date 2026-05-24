package config

import (
	"os"
)

type Config struct {
	Port           string
	DatabaseURL    string
	FrontendOrigin string
	Auth0Domain    string
	Auth0Audience  string
}

func Load() Config {
	return Config{
		Port:           get("PORT", "8080"),
		DatabaseURL:    get("DATABASE_URL", "postgres://nexus:nexus_dev_password@localhost:5432/nexus_commerce?sslmode=disable"),
		FrontendOrigin: get("FRONTEND_ORIGIN", "http://localhost:5173"),
		Auth0Domain:    get("AUTH0_DOMAIN", ""),
		Auth0Audience:  get("AUTH0_AUDIENCE", ""),
	}
}

func get(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}
