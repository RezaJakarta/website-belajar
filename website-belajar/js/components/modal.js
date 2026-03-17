// ==================== MODAL COMPONENT ====================

class ProductModal {
  constructor() {
    this.modal = document.getElementById("quickViewModal");
    this.isOpen = false;
    this.currentProduct = null;

    if (!this.modal) {
      this.createModal();
    } else {
      this.init();
    }
  }

  createModal() {
    this.modal = document.createElement("div");
    this.modal.id = "quickViewModal";
    this.modal.className = "modal";
    this.modal.setAttribute("aria-hidden", "true");

    this.modal.innerHTML = `
            <div class="modal-overlay" tabindex="-1"></div>
            <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <div class="modal-grid">
                    <div class="modal-image">
                        <img src="" alt="Product Image" id="modalProductImage" loading="lazy">
                    </div>
                    <div class="modal-details">
                        <span class="modal-category" id="modalProductCategory"></span>
                        <h2 class="modal-title" id="modalProductName"></h2>
                        <div class="modal-rating">
                            <span class="stars" id="modalProductStars">★★★★★</span>
                            <span class="rating-text" id="modalProductReviews"></span>
                        </div>
                        <p class="modal-description" id="modalProductDescription"></p>
                        
                        <div class="modal-specs">
                            <div class="spec-item">
                                <span class="spec-label">Material</span>
                                <span class="spec-value" id="modalProductMaterial"></span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Origin</span>
                                <span class="spec-value" id="modalProductOrigin"></span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Warranty</span>
                                <span class="spec-value" id="modalProductWarranty"></span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Availability</span>
                                <span class="spec-value" id="modalProductStock"></span>
                            </div>
                        </div>
                        
                        <div class="modal-price">
                            <span class="price-label">Price</span>
                            <span class="price-value" id="modalProductPrice"></span>
                        </div>
                        
                        <div class="modal-actions">
                            <a href="#" id="modalWhatsAppBtn" target="_blank" rel="noopener noreferrer" class="btn-primary modal-wa">Chat WhatsApp</a>
                            <button class="btn-outline modal-wishlist" id="modalWishlistBtn">Add to Wishlist</button>
                        </div>
                        
                        <div class="modal-features" id="modalFeatures"></div>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(this.modal);
    this.init();
  }

  init() {
    // Cache DOM elements
    this.overlay = this.modal.querySelector(".modal-overlay");
    this.closeBtn = this.modal.querySelector(".modal-close");
    this.content = this.modal.querySelector(".modal-content");

    // Bind methods
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    // Add event listeners
    this.closeBtn.addEventListener("click", this.close);
    this.overlay.addEventListener("click", this.close);

    // Prevent closing when clicking inside modal content
    this.content.addEventListener("click", (e) => e.stopPropagation());
  }

  open(product) {
    if (!product) return;

    this.currentProduct = product;
    this.populateData(product);

    this.modal.classList.add("show");
    this.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    this.isOpen = true;

    // Add keyboard listener
    document.addEventListener("keydown", this.handleKeyDown);

    // Trigger open event
    this.modal.dispatchEvent(
      new CustomEvent("modalopen", { detail: { product } }),
    );
  }

  close() {
    this.modal.classList.remove("show");
    this.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    this.isOpen = false;

    // Remove keyboard listener
    document.removeEventListener("keydown", this.handleKeyDown);

    // Trigger close event
    this.modal.dispatchEvent(new CustomEvent("modalclose"));
  }

  handleKeyDown(e) {
    if (e.key === "Escape" && this.isOpen) {
      this.close();
    }
  }

  handleClickOutside(e) {
    if (this.isOpen && !this.content.contains(e.target)) {
      this.close();
    }
  }

  populateData(product) {
    // Basic info
    document.getElementById("modalProductImage").src = `image/${product.image}`;
    document.getElementById("modalProductImage").alt = product.name;
    document.getElementById("modalProductCategory").textContent =
      product.category;
    document.getElementById("modalProductName").textContent = product.name;
    document.getElementById("modalProductDescription").textContent =
      product.description;

    // Specs
    document.getElementById("modalProductMaterial").textContent =
      product.material || "Premium Quality";
    document.getElementById("modalProductOrigin").textContent =
      product.origin || "Italy/Japan";
    document.getElementById("modalProductWarranty").textContent =
      product.warranty || "2 Years";

    // Stock status
    const stockEl = document.getElementById("modalProductStock");
    stockEl.textContent = product.stock || "In Stock";
    stockEl.className = "spec-value";
    if (product.stock && product.stock.includes("Only")) {
      stockEl.classList.add("limited-stock");
    } else if (product.stock && product.stock.includes("In Stock")) {
      stockEl.classList.add("in-stock");
    }

    // Rating
    const stars =
      "★".repeat(product.rating || 5) + "☆".repeat(5 - (product.rating || 5));
    document.getElementById("modalProductStars").textContent = stars;
    document.getElementById("modalProductReviews").textContent =
      `(${product.reviews || 0} reviews)`;

    // Price
    const price = product.price || 0;
    document.getElementById("modalProductPrice").textContent =
      window.helpers?.formatCurrency(price) ||
      `Rp ${price.toLocaleString("id-ID")}`;

    // WhatsApp button
    const waBtn = document.getElementById("modalWhatsAppBtn");
    waBtn.href =
      product.wa ||
      `https://wa.me/6285811139858?text=I%20am%20interested%20in%20${encodeURIComponent(product.name)}`;

    // Wishlist button
    const wishlistBtn = document.getElementById("modalWishlistBtn");
    const isInWishlist = window.wishlistManager?.items.some(
      (item) => item.id === product.id,
    );
    wishlistBtn.textContent = isInWishlist
      ? "Remove from Wishlist"
      : "Add to Wishlist";
    wishlistBtn.onclick = (e) => {
      e.preventDefault();
      if (window.wishlistManager) {
        window.wishlistManager.toggle(product);
        this.populateData(product); // Refresh button state
      }
    };

    // Features
    const featuresContainer = document.getElementById("modalFeatures");
    if (product.features && product.features.length > 0) {
      featuresContainer.innerHTML = product.features
        .map(
          (feature) =>
            `<div class="feature-item"><span class="feature-icon">✓</span><span>${feature}</span></div>`,
        )
        .join("");
    } else {
      featuresContainer.innerHTML = `
                <div class="feature-item"><span class="feature-icon">✓</span><span>Premium Quality</span></div>
                <div class="feature-item"><span class="feature-icon">✓</span><span>Free Shipping</span></div>
                <div class="feature-item"><span class="feature-icon">✓</span><span>Secure Payment</span></div>
            `;
    }
  }

  // Update modal content (useful for dynamic updates)
  update() {
    if (this.currentProduct) {
      this.populateData(this.currentProduct);
    }
  }
}

// Initialize modal
const productModal = new ProductModal();

// Make globally available
window.productModal = productModal;
