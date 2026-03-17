let currentFilter = "all";
let currentSearch = "";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Catalog page loaded");

  initCatalog();
  initFilters();
  initSearch();
  initInfiniteScroll();
  initSort();
});

function initCatalog() {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) {
    console.error("Product grid not found!");
    return;
  }

  const params = window.helpers?.getUrlParams() || {};
  if (params.category) {
    currentFilter = params.category;
    const filterBtn = document.querySelector(
      `.filter-btn[data-filter="${params.category}"]`,
    );
    if (filterBtn) {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      filterBtn.classList.add("active");
    }
  }
  if (params.search) {
    currentSearch = params.search;
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = params.search;
    }
  }

  filterProducts();
}

function initFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.getAttribute("data-filter");

      if (window.helpers) {
        if (currentFilter === "all") {
          window.helpers.removeUrlParam("category");
        } else {
          window.helpers.setUrlParam("category", currentFilter);
        }
      }

      filterProducts();

      const filterName =
        currentFilter === "all" ? "All Products" : currentFilter;
      window.showToast?.(`Showing: ${filterName}`, "info");
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  const debouncedSearch = window.helpers?.debounce(() => {
    currentSearch = searchInput.value.trim();

    if (window.helpers) {
      if (currentSearch) {
        window.helpers.setUrlParam("search", currentSearch);
      } else {
        window.helpers.removeUrlParam("search");
      }
    }

    filterProducts();
  }, 500);

  searchInput.addEventListener("input", debouncedSearch);

  const clearButton = document.createElement("button");
  clearButton.className = "search-clear";
  clearButton.innerHTML = "×";
  clearButton.setAttribute("aria-label", "Clear search");
  clearButton.style.display = "none";

  searchInput.parentNode.appendChild(clearButton);

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    currentSearch = "";
    clearButton.style.display = "none";
    if (window.helpers) {
      window.helpers.removeUrlParam("search");
    }
    filterProducts();
  });

  searchInput.addEventListener("input", () => {
    clearButton.style.display = searchInput.value ? "flex" : "none";
  });
}

function initSort() {
  const sortSelect = document.getElementById("sortSelect");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", () => {
    filterProducts();
  });
}

function filterProducts() {
  const productGrid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");
  const sortSelect = document.getElementById("sortSelect");
  const resultCount = document.getElementById("resultCount");

  if (!productGrid) return;

  productGrid.innerHTML = '<div class="loading-spinner"></div>';

  setTimeout(() => {
    let filtered = window.products || [];

    if (currentFilter !== "all") {
      filtered = filtered.filter((p) => p.category === currentFilter);
    }

    if (currentSearch) {
      const searchTerm = currentSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm),
      );
    }

    if (sortSelect) {
      const sortValue = sortSelect.value;
      switch (sortValue) {
        case "price-low":
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "price-high":
          filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case "name-asc":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "rating":
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
    }

    renderProducts(filtered);

    if (noResults) {
      noResults.style.display = filtered.length === 0 ? "block" : "none";
    }

    if (resultCount) {
      const showingText = window.i18n
        ? window.i18n.t("catalog.showing")
        : "Showing";
      const productsText = window.i18n
        ? window.i18n.t("catalog.products")
        : "products";
      resultCount.innerHTML = `${showingText} ${filtered.length} ${productsText}`;
    }
  }, 500);
}

function renderProducts(products) {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) return;

  productGrid.innerHTML = "";

  if (products.length === 0) {
    productGrid.innerHTML = '<div class="no-products">No products found</div>';
    return;
  }

  // Tambah class khusus jika hanya 1 produk
  if (products.length === 1) {
    productGrid.classList.add("single-product");
  } else {
    productGrid.classList.remove("single-product");
  }

  products.forEach((product, index) => {
    const card = createCatalogCard(product);
    card.style.animationDelay = `${index * 0.05}s`;
    productGrid.appendChild(card);
  });

  addWishlistButtons();
}

function createCatalogCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.setAttribute("data-product-id", product.id);

  const stars = window.productUtils?.getRatingStars(product.rating) || "★★★★★";
  const price =
    window.helpers?.formatCurrency(product.price) ||
    `Rp ${product.price.toLocaleString("id-ID")}`;

  card.innerHTML = `
        <div class="product-badge">${product.category}</div>
        
        <div class="quick-actions">
            <button class="quick-action-btn wishlist-btn" data-product-id="${product.id}" aria-label="Add to wishlist">
                <span class="wishlist-icon">🤍</span>
            </button>
            <button class="quick-action-btn quick-view-btn" data-product-id="${product.id}" aria-label="Quick view">
                👁️
            </button>
        </div>
        
        <img src="image/${product.image}" 
             alt="${product.name}" 
             class="product-image" 
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x300/1a1a1a/c6a45c?text=Product'">
        
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                <span class="stars">${stars}</span>
                <span class="rating-count">(${product.reviews || 0})</span>
            </div>
            <p class="product-description">${window.helpers?.truncateText(product.description, 60) || product.description.substring(0, 60) + "..."}</p>
            <div class="product-price">${price}</div>
            <div class="product-actions">
                <a href="${product.wa}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn-wa-small"
                   onclick="event.stopPropagation()">
                    ${window.i18n ? window.i18n.t("button.quickbuy") : "Quick Buy"}
                </a>
                <button class="btn-detail" data-product-id="${product.id}">${window.i18n ? window.i18n.t("button.detail") : "Detail"}</button>
            </div>
        </div>
    `;

  card.addEventListener("click", (e) => {
    if (
      !e.target.closest(".btn-wa-small") &&
      !e.target.closest(".btn-detail") &&
      !e.target.closest(".quick-action-btn")
    ) {
      if (window.productModal) {
        window.productModal.open(product);
      }
    }
  });

  const detailBtn = card.querySelector(".btn-detail");
  detailBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.productModal) {
      window.productModal.open(product);
    }
  });

  const quickViewBtn = card.querySelector(".quick-view-btn");
  quickViewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.productModal) {
      window.productModal.open(product);
    }
  });

  return card;
}

function addWishlistButtons() {
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const productId = btn.dataset.productId;
    const product = window.products?.find((p) => p.id == productId);

    if (product && window.wishlistManager) {
      const isInWishlist = window.wishlistManager.has(productId);
      btn.classList.toggle("active", isInWishlist);
      btn.querySelector(".wishlist-icon").textContent = isInWishlist
        ? "❤️"
        : "🤍";

      btn.replaceWith(btn.cloneNode(true));
      const newBtn = document.querySelector(
        `.wishlist-btn[data-product-id="${productId}"]`,
      );

      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.wishlistManager.toggle(product);

        const isNowInWishlist = window.wishlistManager.has(productId);
        newBtn.classList.toggle("active", isNowInWishlist);
        newBtn.querySelector(".wishlist-icon").textContent = isNowInWishlist
          ? "❤️"
          : "🤍";
      });
    }
  });
}

function initInfiniteScroll() {
  let page = 1;
  const productsPerPage = 12;
  let loading = false;
  let hasMore = true;

  window.addEventListener(
    "scroll",
    window.helpers?.throttle(() => {
      if (loading || !hasMore) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 1000;

      if (scrollPosition >= threshold) {
        loadMore();
      }
    }, 200),
  );

  function loadMore() {
    loading = true;

    const loadingSpinner = document.createElement("div");
    loadingSpinner.className = "loading-spinner";
    document
      .querySelector(".catalog-page .container")
      .appendChild(loadingSpinner);

    setTimeout(() => {
      loadingSpinner.remove();
      loading = false;

      if (page * productsPerPage >= (window.products?.length || 0)) {
        hasMore = false;
        const endMessage = document.createElement("div");
        endMessage.className = "no-products";
        endMessage.textContent = "You've reached the end of the catalog";
        document
          .querySelector(".catalog-page .container")
          .appendChild(endMessage);
      }

      page++;
    }, 1000);
  }
}

const catalogStyle = document.createElement("style");
catalogStyle.textContent = `
    .catalog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        flex-wrap: wrap;
        gap: 20px;
    }
    
    .result-count {
        color: #999;
        font-size: 0.95rem;
    }
    
    .sort-select {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--white);
        padding: 10px 25px;
        border-radius: 30px;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .sort-select:focus {
        outline: none;
        border-color: var(--gold);
    }
    
    .sort-select option {
        background: var(--black-light);
        color: var(--white);
    }
    
    .search-clear {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: var(--white);
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-base);
    }
    
    .search-clear:hover {
        background: var(--gold);
        color: var(--black);
    }
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(198, 164, 92, 0.3);
        border-top-color: var(--gold);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 40px auto;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

document.head.appendChild(catalogStyle);
