// ==================== WISHLIST COMPONENT ====================

class WishlistManager {
  constructor() {
    this.items = [];
    this.storageKey = "gm_wishlist";
    this.listeners = [];

    this.load();
    this.init();
  }

  init() {
    // Load from storage
    this.load();

    // Update UI
    this.updateUI();

    // Listen for storage changes (cross-tab)
    window.addEventListener("storage", (e) => {
      if (e.key === this.storageKey) {
        this.load();
        this.notifyListeners();
      }
    });
  }

  // Load from localStorage
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.items = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading wishlist:", error);
      this.items = [];
    }
  }

  // Save to localStorage
  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      this.notifyListeners();

      // Dispatch storage event for other tabs
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: this.storageKey,
          newValue: JSON.stringify(this.items),
        }),
      );
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  }

  // Add item to wishlist
  add(product) {
    if (!this.items.some((item) => item.id === product.id)) {
      this.items.push(product);
      this.save();
      this.showNotification(`${product.name} added to wishlist`, "success");
      return true;
    }
    return false;
  }

  // Remove item from wishlist
  remove(productId) {
    const index = this.items.findIndex((item) => item.id == productId);
    if (index !== -1) {
      const product = this.items[index];
      this.items.splice(index, 1);
      this.save();
      this.showNotification(`${product.name} removed from wishlist`, "info");
      return true;
    }
    return false;
  }

  // Toggle item in wishlist
  toggle(product) {
    const exists = this.items.some((item) => item.id === product.id);
    if (exists) {
      this.remove(product.id);
      return false;
    } else {
      this.add(product);
      return true;
    }
  }

  // Check if product is in wishlist
  has(productId) {
    return this.items.some((item) => item.id == productId);
  }

  // Get all items
  getAll() {
    return [...this.items];
  }

  // Get count
  getCount() {
    return this.items.length;
  }

  // Clear wishlist
  clear() {
    this.items = [];
    this.save();
    this.showNotification("Wishlist cleared", "info");
  }

  // Add listener
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.items));
    this.updateUI();
  }

  // Update UI elements
  updateUI() {
    // Update wishlist count
    const countElements = document.querySelectorAll(".wishlist-count");
    countElements.forEach((el) => {
      el.textContent = this.getCount();
    });

    // Update wishlist buttons
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");
    wishlistBtns.forEach((btn) => {
      const productId = btn.dataset.productId;
      const isInWishlist = this.has(productId);

      btn.classList.toggle("active", isInWishlist);
      btn.setAttribute(
        "aria-label",
        isInWishlist ? "Remove from wishlist" : "Add to wishlist",
      );

      // Update icon/text if needed
      const icon = btn.querySelector(".wishlist-icon");
      if (icon) {
        icon.textContent = isInWishlist ? "❤️" : "🤍";
      }
    });
  }

  // Show notification
  showNotification(message, type = "success") {
    if (window.showToast) {
      window.showToast(message, type);
    }
  }

  // Get wishlist page HTML
  getWishlistPageHTML() {
    if (this.items.length === 0) {
      return `
                <div class="empty-wishlist">
                    <div class="empty-icon">❤️</div>
                    <h3>Your wishlist is empty</h3>
                    <p>Start adding your favorite items to your wishlist</p>
                    <a href="catalog.html" class="btn-primary">Browse Collection</a>
                </div>
            `;
    }

    return this.items
      .map(
        (product) => `
            <div class="wishlist-item" data-product-id="${product.id}">
                <img src="image/${product.image}" alt="${product.name}" class="wishlist-image" loading="lazy">
                <div class="wishlist-info">
                    <h3 class="wishlist-name">${product.name}</h3>
                    <span class="wishlist-category">${product.category}</span>
                    <span class="wishlist-price">${window.helpers?.formatCurrency(product.price) || `Rp ${product.price.toLocaleString("id-ID")}`}</span>
                </div>
                <div class="wishlist-actions">
                    <a href="${product.wa}" target="_blank" rel="noopener noreferrer" class="btn-wa-small">WhatsApp</a>
                    <button class="btn-outline wishlist-remove" onclick="wishlistManager.remove(${product.id})">Remove</button>
                </div>
            </div>
        `,
      )
      .join("");
  }
}

// Initialize wishlist manager
const wishlistManager = new WishlistManager();

// Make globally available
window.wishlistManager = wishlistManager;
