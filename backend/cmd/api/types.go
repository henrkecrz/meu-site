package main

import (
	"time"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type App struct {
	DB       *pgxpool.Pool
	JWKS     keyfunc.Keyfunc
	Audience string
}

type Product struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	Slug          string  `json:"slug"`
	Description   string  `json:"description"`
	ImageEmoji    string  `json:"imageEmoji"`
	PriceCents    int     `json:"priceCents"`
	OldPriceCents *int    `json:"oldPriceCents"`
	Stock         int     `json:"stock"`
	Rating        float64 `json:"rating"`
	ReviewCount   int     `json:"reviewCount"`
	SellerName    string  `json:"sellerName"`
	CategorySlug  string  `json:"categorySlug"`
}

type Category struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
	Icon string `json:"icon"`
}

type UserProfile struct {
	ID              string `json:"id"`
	IdentitySubject string `json:"identitySubject"`
	Email           string `json:"email"`
	Name            string `json:"name"`
	PictureURL      string `json:"pictureUrl"`
	Role            string `json:"role"`
}

type SyncProfileRequest struct {
	Email      string `json:"email"`
	Name       string `json:"name"`
	PictureURL string `json:"pictureUrl"`
}

type AddCartItemRequest struct {
	ProductID string `json:"productId"`
	Quantity  int    `json:"quantity"`
}

type CartItem struct {
	ProductID   string  `json:"productId"`
	Name        string  `json:"name"`
	Slug        string  `json:"slug"`
	ImageEmoji  string  `json:"imageEmoji"`
	PriceCents  int     `json:"priceCents"`
	Quantity    int     `json:"quantity"`
	LineTotal   int     `json:"lineTotal"`
	SellerName  string  `json:"sellerName"`
	Rating      float64 `json:"rating"`
	ReviewCount int     `json:"reviewCount"`
}

type CartResponse struct {
	CartID     string     `json:"cartId"`
	Items      []CartItem `json:"items"`
	ItemCount  int        `json:"itemCount"`
	TotalCents int        `json:"totalCents"`
}

type OrderResponse struct {
	OrderID    string     `json:"orderId"`
	Status     string     `json:"status"`
	TotalCents int        `json:"totalCents"`
	Items      []CartItem `json:"items"`
	CreatedAt  time.Time  `json:"createdAt"`
}

type SellerDashboard struct {
	SellerID       string `json:"sellerId"`
	SellerName     string `json:"sellerName"`
	ProductsActive int    `json:"productsActive"`
	StockTotal     int    `json:"stockTotal"`
	ItemsSold      int    `json:"itemsSold"`
	RevenueCents   int    `json:"revenueCents"`
	OrdersCount    int    `json:"ordersCount"`
}

type AdminDashboard struct {
	UsersCount   int `json:"usersCount"`
	SellersCount int `json:"sellersCount"`
	ProductsCount int `json:"productsCount"`
	OrdersCount  int `json:"ordersCount"`
	RevenueCents int `json:"revenueCents"`
	StockTotal   int `json:"stockTotal"`
}

type Claims struct {
	Permissions []string `json:"permissions"`
	Email       string   `json:"email"`
	Name        string   `json:"name"`
	Picture     string   `json:"picture"`
	jwt.RegisteredClaims
}
