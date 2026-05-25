package main

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type AdminActionRequest struct {
	Role   string `json:"role"`
	Status string `json:"status"`
}

func (a *App) adminSetUserRole(w http.ResponseWriter, r *http.Request) {
	if !a.requireAdmin(w, r) {
		return
	}
	var input AdminActionRequest
	_ = json.NewDecoder(r.Body).Decode(&input)
	if input.Role != "customer" && input.Role != "seller" && input.Role != "admin" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid role"})
		return
	}
	_, err := a.DB.Exec(r.Context(), `UPDATE user_profiles SET role = $1, updated_at = now() WHERE id = $2`, input.Role, chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "role": input.Role})
}

func (a *App) adminUpdateSellerStatus(w http.ResponseWriter, r *http.Request) {
	if !a.requireAdmin(w, r) {
		return
	}
	var input AdminActionRequest
	_ = json.NewDecoder(r.Body).Decode(&input)
	if input.Status != "active" && input.Status != "pending" && input.Status != "suspended" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid seller status"})
		return
	}
	_, err := a.DB.Exec(r.Context(), `UPDATE sellers SET status = $1 WHERE id = $2`, input.Status, chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "status": input.Status})
}

func (a *App) adminUpdateProductStatus(w http.ResponseWriter, r *http.Request) {
	if !a.requireAdmin(w, r) {
		return
	}
	var input AdminActionRequest
	_ = json.NewDecoder(r.Body).Decode(&input)
	if input.Status != "active" && input.Status != "paused" && input.Status != "out_of_stock" && input.Status != "archived" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid product status"})
		return
	}
	_, err := a.DB.Exec(r.Context(), `UPDATE products SET status = $1 WHERE id = $2`, input.Status, chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "status": input.Status})
}

func (a *App) adminUpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	if !a.requireAdmin(w, r) {
		return
	}
	var input AdminActionRequest
	_ = json.NewDecoder(r.Body).Decode(&input)
	if input.Status != "pending" && input.Status != "paid" && input.Status != "shipped" && input.Status != "delivered" && input.Status != "cancelled" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid order status"})
		return
	}
	_, err := a.DB.Exec(r.Context(), `UPDATE orders SET status = $1 WHERE id = $2`, input.Status, chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "status": input.Status})
}
