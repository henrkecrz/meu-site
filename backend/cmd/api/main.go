package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
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

type Claims struct {
	Permissions []string `json:"permissions"`
	Email       string   `json:"email"`
	Name        string   `json:"name"`
	Picture     string   `json:"picture"`
	jwt.RegisteredClaims
}

func main() {
	ctx := context.Background()
	port := getenv("PORT", "8080")
	databaseURL := getenv("DATABASE_URL", "postgres://nexus:nexus_dev_password@localhost:5432/nexus_commerce?sslmode=disable")
	frontendOrigin := getenv("FRONTEND_ORIGIN", "http://localhost:5173")
	auth0Domain := strings.TrimRight(os.Getenv("AUTH0_DOMAIN"), "/")
	audience := os.Getenv("AUTH0_AUDIENCE")

	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()
	if err := pool.Ping(ctx); err != nil {
		log.Fatal(err)
	}

	var jwks keyfunc.Keyfunc
	if auth0Domain != "" {
		jwksURL := fmt.Sprintf("%s/.well-known/jwks.json", auth0Domain)
		jwks, err = keyfunc.NewDefaultCtx(ctx, []string{jwksURL})
		if err != nil {
			log.Fatal(err)
		}
	}

	app := &App{DB: pool, JWKS: jwks, Audience: audience}

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{frontendOrigin},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]any{"status": "ok", "time": time.Now().UTC()})
	})
	r.Get("/api/categories", app.listCategories)
	r.Get("/api/products", app.listProducts)
	r.Get("/api/products/{slug}", app.getProduct)

	r.Group(func(private chi.Router) {
		private.Use(app.authMiddleware)
		private.Get("/api/me", app.me)
		private.Post("/api/profile/sync", app.syncProfile)
		private.Get("/api/cart", app.getCart)
		private.Post("/api/cart/items", app.addCartItem)
		private.Post("/api/orders", app.createOrder)
	})

	log.Printf("Nexus API listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

func (a *App) listCategories(w http.ResponseWriter, r *http.Request) {
	rows, err := a.DB.Query(r.Context(), `SELECT id, name, slug, icon FROM categories ORDER BY name`)
	if err != nil { writeError(w, err); return }
	defer rows.Close()
	items := []Category{}
	for rows.Next() {
		var c Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.Icon); err != nil { writeError(w, err); return }
		items = append(items, c)
	}
	writeJSON(w, http.StatusOK, items)
}

func (a *App) listProducts(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	query := strings.TrimSpace(r.URL.Query().Get("q"))
	sql := `SELECT p.id, p.name, p.slug, p.description, p.image_emoji, p.price_cents, p.old_price_cents, p.stock, p.rating, p.review_count, s.name, c.slug
		FROM products p
		JOIN sellers s ON s.id = p.seller_id
		JOIN categories c ON c.id = p.category_id
		WHERE ($1 = '' OR c.slug = $1) AND ($2 = '' OR p.name ILIKE '%' || $2 || '%')
		ORDER BY p.is_featured DESC, p.created_at DESC
		LIMIT 48`
	rows, err := a.DB.Query(r.Context(), sql, category, query)
	if err != nil { writeError(w, err); return }
	defer rows.Close()
	products, err := scanProducts(rows)
	if err != nil { writeError(w, err); return }
	writeJSON(w, http.StatusOK, products)
}

func (a *App) getProduct(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	row := a.DB.QueryRow(r.Context(), `SELECT p.id, p.name, p.slug, p.description, p.image_emoji, p.price_cents, p.old_price_cents, p.stock, p.rating, p.review_count, s.name, c.slug
		FROM products p
		JOIN sellers s ON s.id = p.seller_id
		JOIN categories c ON c.id = p.category_id
		WHERE p.slug = $1`, slug)
	var p Product
	if err := row.Scan(&p.ID, &p.Name, &p.Slug, &p.Description, &p.ImageEmoji, &p.PriceCents, &p.OldPriceCents, &p.Stock, &p.Rating, &p.ReviewCount, &p.SellerName, &p.CategorySlug); err != nil { writeError(w, err); return }
	writeJSON(w, http.StatusOK, p)
}

func (a *App) me(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value("claims").(*Claims)
	profile, err := a.getProfileBySubject(r.Context(), claims.Subject)
	if err == nil {
		writeJSON(w, http.StatusOK, map[string]any{"subject": claims.Subject, "permissions": claims.Permissions, "profile": profile})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"subject": claims.Subject, "permissions": claims.Permissions})
}

func (a *App) syncProfile(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value("claims").(*Claims)
	var input SyncProfileRequest
	_ = json.NewDecoder(r.Body).Decode(&input)
	if input.Email == "" { input.Email = claims.Email }
	if input.Name == "" { input.Name = claims.Name }
	if input.PictureURL == "" { input.PictureURL = claims.Picture }
	if input.Email == "" {
		input.Email = fmt.Sprintf("%s@nexus.local", strings.ReplaceAll(claims.Subject, "|", "-"))
	}

	row := a.DB.QueryRow(r.Context(), `INSERT INTO user_profiles (identity_subject, email, name, picture_url, role)
		VALUES ($1, $2, $3, $4, 'customer')
		ON CONFLICT (identity_subject) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, picture_url = EXCLUDED.picture_url, updated_at = now()
		RETURNING id, identity_subject, email, COALESCE(name, ''), COALESCE(picture_url, ''), role`, claims.Subject, input.Email, input.Name, input.PictureURL)
	var profile UserProfile
	if err := row.Scan(&profile.ID, &profile.IdentitySubject, &profile.Email, &profile.Name, &profile.PictureURL, &profile.Role); err != nil { writeError(w, err); return }
	writeJSON(w, http.StatusOK, profile)
}

func (a *App) getProfileBySubject(ctx context.Context, subject string) (UserProfile, error) {
	row := a.DB.QueryRow(ctx, `SELECT id, identity_subject, email, COALESCE(name, ''), COALESCE(picture_url, ''), role FROM user_profiles WHERE identity_subject = $1`, subject)
	var profile UserProfile
	err := row.Scan(&profile.ID, &profile.IdentitySubject, &profile.Email, &profile.Name, &profile.PictureURL, &profile.Role)
	return profile, err
}

func (a *App) getCart(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value("claims").(*Claims)
	cartID, err := a.getOrCreateOpenCart(r.Context(), claims.Subject)
	if err != nil { writeError(w, err); return }
	cart, err := a.buildCartResponse(r.Context(), cartID)
	if err != nil { writeError(w, err); return }
	writeJSON(w, http.StatusOK, cart)
}

func (a *App) addCartItem(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value("claims").(*Claims)
	var input AddCartItemRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil { writeError(w, err); return }
	if input.ProductID == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "productId is required"})
		return
	}
	if input.Quantity <= 0 { input.Quantity = 1 }
	if input.Quantity > 99 { input.Quantity = 99 }

	cartID, err := a.getOrCreateOpenCart(r.Context(), claims.Subject)
	if err != nil { writeError(w, err); return }

	_, err = a.DB.Exec(r.Context(), `INSERT INTO cart_items (cart_id, product_id, quantity)
		VALUES ($1, $2, $3)
		ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`, cartID, input.ProductID, input.Quantity)
	if err != nil { writeError(w, err); return }

	cart, err := a.buildCartResponse(r.Context(), cartID)
	if err != nil { writeError(w, err); return }
	writeJSON(w, http.StatusCreated, cart)
}

func (a *App) getOrCreateOpenCart(ctx context.Context, customerRef string) (string, error) {
	var cartID string
	err := a.DB.QueryRow(ctx, `SELECT id FROM carts WHERE customer_ref = $1 AND status = 'open' ORDER BY created_at DESC LIMIT 1`, customerRef).Scan(&cartID)
	if err == nil { return cartID, nil }
	if !errors.Is(err, pgx.ErrNoRows) { return "", err }
	err = a.DB.QueryRow(ctx, `INSERT INTO carts (customer_ref, status) VALUES ($1, 'open') RETURNING id`, customerRef).Scan(&cartID)
	return cartID, err
}

func (a *App) buildCartResponse(ctx context.Context, cartID string) (CartResponse, error) {
	rows, err := a.DB.Query(ctx, `SELECT p.id, p.name, p.slug, p.image_emoji, p.price_cents, ci.quantity, s.name, p.rating, p.review_count
		FROM cart_items ci
		JOIN products p ON p.id = ci.product_id
		JOIN sellers s ON s.id = p.seller_id
		WHERE ci.cart_id = $1
		ORDER BY p.name`, cartID)
	if err != nil { return CartResponse{}, err }
	defer rows.Close()

	cart := CartResponse{CartID: cartID, Items: []CartItem{}}
	for rows.Next() {
		var item CartItem
		if err := rows.Scan(&item.ProductID, &item.Name, &item.Slug, &item.ImageEmoji, &item.PriceCents, &item.Quantity, &item.SellerName, &item.Rating, &item.ReviewCount); err != nil {
			return CartResponse{}, err
		}
		item.LineTotal = item.PriceCents * item.Quantity
		cart.TotalCents += item.LineTotal
		cart.ItemCount += item.Quantity
		cart.Items = append(cart.Items, item)
	}
	return cart, rows.Err()
}

func (a *App) createOrder(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusCreated, map[string]any{"ok": true, "message": "order created"})
}

func (a *App) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if a.JWKS == nil || a.Audience == "" {
			writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "auth0 not configured"})
			return
		}
		header := r.Header.Get("Authorization")
		parts := strings.Split(header, " ")
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "missing bearer token"})
			return
		}
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(parts[1], claims, a.JWKS.Keyfunc)
		if err != nil || !token.Valid {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid token"})
			return
		}
		if !claims.VerifyAudience(a.Audience, true) {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid audience"})
			return
		}
		ctx := context.WithValue(r.Context(), "claims", claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

type productRows interface { Next() bool; Scan(dest ...any) error; Err() error }

func scanProducts(rows productRows) ([]Product, error) {
	items := []Product{}
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Slug, &p.Description, &p.ImageEmoji, &p.PriceCents, &p.OldPriceCents, &p.Stock, &p.Rating, &p.ReviewCount, &p.SellerName, &p.CategorySlug); err != nil {
			return nil, err
		}
		items = append(items, p)
	}
	return items, rows.Err()
}

func getenv(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" { return fallback }
	return value
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, err error) {
	status := http.StatusInternalServerError
	if errors.Is(err, context.Canceled) { status = http.StatusRequestTimeout }
	writeJSON(w, status, map[string]string{"error": err.Error()})
}
