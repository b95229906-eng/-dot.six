# dot.six — Clothing & Everyday Style

Official open-source repository for **dot.six** ([_dot.six](https://www.instagram.com/_dot.six)), a minimalist black-and-white streetwear clothing e-commerce website inspired by high-end aesthetics like *Blur Village*.

## 🚀 Features

- **Minimalist Aesthetic:** Clean, monochrome Black & White streetwear design, full-width product grids, and smooth image zoom hover effects.
- **Interactive Storefront (`index.html`):** 
  - Dynamic product catalog supporting up to 100+ items with category filtering (T-Shirts, Hoodies, Bottoms, Outerwear).
  - Size selectors (S, M, L, XL, etc.) and a smooth slide-out shopping bag drawer.
  - Simulated secure online UPI checkout flow.
- **Secret Password-Protected Admin Panel (`admin.html`):**
  - Completely hidden from public view (no links exposed anywhere in the footer or menus).
  - Protected by a 4-digit security PIN (**`0606`**).
  - Full CRUD capabilities: Add new clothing drops, edit prices or image URLs, and manage stock quantities on the fly with persistent local storage.

---

## 🛠️ Project Structure

```text
├── index.html       # Main public storefront page
├── admin.html       # Secret PIN-protected product management dashboard
├── style.css        # Global minimalist CSS styling (Black & white theme)
├── app.js           # Store logic, cart management, and inventory handling
└── README.md        # Repository documentation
