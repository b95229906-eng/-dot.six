// Initial sample collection (You can add up to 100+ items easily via the secret admin panel)
const defaultProducts = [
    {
        id: "prod-1",
        name: "Heavyweight Boxy Tee",
        category: "T-Shirts",
        price: 1299,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
        sizes: ["S", "M", "L", "XL"],
        stock: 50,
        description: "240 GSM combed cotton structured boxy fit tee in crisp black."
    },
    {
        id: "prod-2",
        name: "Minimalist Hooded Sweatshirt",
        category: "Hoodies & Sweatshirts",
        price: 2499,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
        sizes: ["S", "M", "L", "XL"],
        stock: 40,
        description: "Brushed fleece heavyweight hoodie with subtle tonal dot branding."
    },
    {
        id: "prod-3",
        name: "Relaxed Utility Cargo Pant",
        category: "Bottoms",
        price: 2999,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
        sizes: ["28", "30", "32", "34"],
        stock: 35,
        description: "Relaxed fit utility cargo trousers with adjustable drawcords."
    },
    {
        id: "prod-4",
        name: "Essential White Tee",
        category: "T-Shirts",
        price: 1199,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80",
        sizes: ["S", "M", "L", "XL"],
        stock: 60,
        description: "Pure organic cotton daily essential tee in stark white."
    },
    {
        id: "prod-5",
        name: "Structured Zip Jacket",
        category: "Outerwear",
        price: 3499,
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
        sizes: ["M", "L", "XL"],
        stock: 25,
        description: "Weather-resistant structured daily zip jacket."
    }
];

function getProducts() {
    const stored = localStorage.getItem("dotsix_products");
    if (!stored) {
        localStorage.setItem("dotsix_products", JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return JSON.parse(stored);
}

function saveProducts(products) {
    localStorage.setItem("dotsix_products", JSON.stringify(products));
}

function getCart() {
    return JSON.parse(localStorage.getItem("dotsix_cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("dotsix_cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cartCount");
    const drawerBadge = document.getElementById("drawerCartCount");
    if (badge) badge.innerText = count;
    if (drawerBadge) drawerBadge.innerText = count;
}

// Storefront Logic
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    const productGrid = document.getElementById("productGrid");
    if (productGrid) {
        renderStorefrontProducts("all");

        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                filterBtns.forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
                renderStorefrontProducts(e.target.getAttribute("data-filter"));
            });
        });
    }

    const cartBtn = document.getElementById("cartBtn");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");

    if (cartBtn) {
        cartBtn.addEventListener("click", () => {
            renderCartDrawerItems();
            cartDrawer.classList.add("open");
            cartOverlay.classList.add("open");
        });
    }

    if (closeCart) closeCart.addEventListener("click", closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

    const checkoutBtn = document.getElementById("checkoutBtn");
    const checkoutModal = document.getElementById("checkoutModal");
    const closeModal = document.getElementById("closeModal");

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            const cart = getCart();
            if (cart.length === 0) {
                alert("Your shopping bag is empty.");
                return;
            }
            closeCartDrawer();
            checkoutModal.classList.add("open");
        });
    }

    if (closeModal) closeModal.addEventListener("click", () => checkoutModal.classList.remove("open"));

    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("custName").value;
            const address = document.getElementById("custAddress").value;
            
            alert(`Redirecting to Secure UPI Gateway...\n\nThank you ${name}! Order registered for delivery to: ${address}.`);
            
            localStorage.removeItem("dotsix_cart");
            updateCartCount();
            checkoutModal.classList.remove("open");
            checkoutForm.reset();
        });
    }

    // Admin Panel Logic
    const adminTableBody = document.getElementById("adminProductTableBody");
    if (adminTableBody) {
        renderAdminTable();

        const openAddModalBtn = document.getElementById("openAddModalBtn");
        const productModal = document.getElementById("productModal");
        const closeProductModal = document.getElementById("closeProductModal");
        const productForm = document.getElementById("productForm");

        openAddModalBtn.addEventListener("click", () => {
            document.getElementById("modalTitle").innerText = "Add New Product";
            productForm.reset();
            document.getElementById("editProductId").value = "";
            productModal.classList.add("open");
        });

        closeProductModal.addEventListener("click", () => productModal.classList.remove("open"));

        productForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const idField = document.getElementById("editProductId").value;
            const name = document.getElementById("prodName").value;
            const category = document.getElementById("prodCategory").value;
            const price = Number(document.getElementById("prodPrice").value);
            const image = document.getElementById("prodImage").value;
            const sizes = document.getElementById("prodSizes").value.split(",").map(s => s.trim());
            const stock = Number(document.getElementById("prodStock").value);
            const description = document.getElementById("prodDesc").value;

            let products = getProducts();

            if (idField) {
                products = products.map(p => p.id === idField ? { ...p, name, category, price, image, sizes, stock, description } : p);
            } else {
                const newProduct = {
                    id: "prod-" + Date.now(),
                    name, category, price, image, sizes, stock, description
                };
                products.unshift(newProduct); // Add new item to top
            }

            saveProducts(products);
            productModal.classList.remove("open");
            renderAdminTable();
        });
    }
});

function closeCartDrawer() {
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    if (cartDrawer) cartDrawer.classList.remove("open");
    if (cartOverlay) cartOverlay.classList.remove("open");
}

function renderStorefrontProducts(filter) {
    const productGrid = document.getElementById("productGrid");
    const products = getProducts();
    const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

    if (filtered.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 60px;">No products found in this category.</p>`;
        return;
    }

    productGrid.innerHTML = filtered.map(product => {
        return `
            <div class="product-card">
                <div class="product-image-wrap">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600'">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">₹${product.price.toLocaleString()}</div>
                    <div class="size-selector" id="sizes-${product.id}">
                        ${product.sizes.map((size, idx) => `
                            <button class="size-btn ${idx === 0 ? 'selected' : ''}" onclick="selectSize('${product.id}', '${size}', this)">${size}</button>
                        `).join('')}
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">Add to Bag</button>
                </div>
            </div>
        `;
    }).join('');
}

const selectedSizes = {};
function selectSize(productId, size, btnElement) {
    selectedSizes[productId] = size;
    const container = document.getElementById(`sizes-${productId}`);
    container.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
    btnElement.classList.add("selected");
}

function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const chosenSize = selectedSizes[productId] || (product.sizes ? product.sizes[0] : "M");
    const cart = getCart();

    const existingIndex = cart.findIndex(item => item.id === productId && item.size === chosenSize);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: chosenSize,
            quantity: 1
        });
    }

    saveCart(cart);
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    if (cartDrawer) cartDrawer.classList.add("open");
    if (cartOverlay) cartOverlay.classList.add("open");
    renderCartDrawerItems();
}

function renderCartDrawerItems() {
    const container = document.getElementById("cartItemsContainer");
    const subtotalEl = document.getElementById("cartSubtotal");
    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #666; margin-top: 40px;">Your shopping bag is empty.</p>`;
        if (subtotalEl) subtotalEl.innerText = "₹0";
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map((item, index) => {
        subtotal += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-meta">Size: ${item.size} | Qty: ${item.quantity}</div>
                    <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
                    <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    if (subtotalEl) subtotalEl.innerText = `₹${subtotal.toLocaleString()}`;
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartDrawerItems();
}

function renderAdminTable() {
    const tbody = document.getElementById("adminProductTableBody");
    const products = getProducts();
    
    const countBadge = document.getElementById("productCountBadge");
    if (countBadge) countBadge.innerText = `Total Products: ${products.length}`;

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #666; padding: 40px;">No products in inventory. Click 'Add New Product'.</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image}" class="admin-thumb" alt="" onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100'"></td>
            <td><strong>${p.name}</strong><br><small style="color:#666;">${p.category}</small></td>
            <td>${p.category}</td>
            <td>₹${p.price.toLocaleString()}</td>
            <td>${p.sizes ? p.sizes.join(', ') : ''}</td>
            <td>${p.stock}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon" onclick="editProduct('${p.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon delete" onclick="deleteProduct('${p.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById("modalTitle").innerText = "Edit Product";
    document.getElementById("editProductId").value = product.id;
    document.getElementById("prodName").value = product.name;
    document.getElementById("prodCategory").value = product.category;
    document.getElementById("prodPrice").value = product.price;
    document.getElementById("prodImage").value = product.image;
    document.getElementById("prodSizes").value = product.sizes ? product.sizes.join(', ') : "S, M, L, XL";
    document.getElementById("prodStock").value = product.stock;
    document.getElementById("prodDesc").value = product.description || "";

    document.getElementById("productModal").classList.add("open");
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        renderAdminTable();
    }
}
