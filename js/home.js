// ==================== HOME PAGE ====================

// Three.js Configuration
const THREE_CONFIG = {
  particleCount: 3000,
  particleSize: 0.08,
  sphereRadius: 8,
  centerSphereRadius: 1.2,
  rotationSpeed: 0.0003,
  mouseSmoothness: 0.05,
};

// Initialize Three.js background
function initThree() {
  const canvas = document.getElementById("three-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvas.appendChild(renderer.domElement);

  // Create particle system
  const particles = createParticles();
  scene.add(particles);

  // Create center sphere group
  const sphereGroup = createSphereGroup();
  scene.add(sphereGroup);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xc6a45c, 1, 20);
  pointLight1.position.set(2, 3, 4);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 20);
  pointLight2.position.set(-3, -1, 2);
  scene.add(pointLight2);

  camera.position.z = 10;

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = performance.now() * 0.001;

    // Smooth mouse follow
    targetX += (mouseX * 3 - targetX) * THREE_CONFIG.mouseSmoothness;
    targetY += (-mouseY * 2 - targetY) * THREE_CONFIG.mouseSmoothness;

    // Rotate particles
    particles.rotation.y += THREE_CONFIG.rotationSpeed;
    particles.rotation.x += THREE_CONFIG.rotationSpeed * 0.3;

    // Animate sphere group
    sphereGroup.rotation.y += 0.001;
    sphereGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

    // Camera movement
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener("resize", handleResize);

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Create particle system
function createParticles() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(THREE_CONFIG.particleCount * 3);
  const colors = new Float32Array(THREE_CONFIG.particleCount * 3);

  for (let i = 0; i < THREE_CONFIG.particleCount; i++) {
    // Position in sphere
    const radius = THREE_CONFIG.sphereRadius + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Color based on position
    const color = new THREE.Color();
    const hue = 0.1 + (y / 10) * 0.1; // Gold variations
    color.setHSL(hue, 0.8, 0.5 + (z / 10) * 0.2);

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: THREE_CONFIG.particleSize,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    map: createParticleTexture(),
  });

  return new THREE.Points(geometry, material);
}

// Create sphere group
function createSphereGroup() {
  const group = new THREE.Group();

  // Center sphere
  const centerGeo = new THREE.SphereGeometry(
    THREE_CONFIG.centerSphereRadius,
    48,
    48,
  );
  const centerMat = new THREE.MeshPhongMaterial({
    color: 0xc6a45c,
    emissive: 0x332211,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const centerSphere = new THREE.Mesh(centerGeo, centerMat);
  group.add(centerSphere);

  // Orbiting spheres
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 2.5;

    const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xc6a45c,
      emissive: 0x442200,
      roughness: 0.2,
      metalness: 0.8,
    });

    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.5,
      0,
    );

    group.add(sphere);
  }

  return group;
}

// Create particle texture
function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");

  // Create gradient circle
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.5, "rgba(198,164,92,0.8)");
  gradient.addColorStop(1, "rgba(198,164,92,0)");

  ctx.clearRect(0, 0, 32, 32);
  ctx.beginPath();
  ctx.arc(16, 16, 14, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// Render featured products
function renderFeaturedProducts(category = "all") {
  const featuredGrid = document.getElementById("featuredProducts");
  if (!featuredGrid) return;

  // Show loading skeleton
  featuredGrid.innerHTML = Array(4)
    .fill(0)
    .map(
      () => `
        <div class="product-card skeleton">
            <div class="product-image" style="height: 280px;"></div>
            <div class="product-info">
                <div style="height: 24px; width: 70%; margin-bottom: 10px;"></div>
                <div style="height: 16px; width: 40%; margin-bottom: 10px;"></div>
                <div style="height: 48px; width: 100%; margin-bottom: 10px;"></div>
                <div style="height: 40px; width: 100%;"></div>
            </div>
        </div>
    `,
    )
    .join("");

  // Get filtered products
  let products = window.products || [];
  if (category !== "all") {
    products = products.filter((p) => p.category === category);
  }

  // Simulate loading delay
  setTimeout(() => {
    const featured = products.slice(0, 4);
    featuredGrid.innerHTML = "";

    if (featured.length === 0) {
      featuredGrid.innerHTML =
        '<div class="no-products">No products in this category</div>';
      return;
    }

    featured.forEach((product, index) => {
      const card = createProductCard(product);
      card.style.animationDelay = `${index * 0.1}s`;
      featuredGrid.appendChild(card);
    });

    // Add wishlist buttons
    addWishlistButtons();
  }, 500);
}

// Create product card
function createProductCard(product) {
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
             onerror="this.src='image/placeholder.jpg'">
        
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
                    Quick Buy
                </a>
                <button class="btn-detail" data-product-id="${product.id}">View Details</button>
            </div>
        </div>
    `;

  // Add event listeners
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

// Add wishlist buttons functionality
function addWishlistButtons() {
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const productId = btn.dataset.productId;
    const product = window.products?.find((p) => p.id == productId);

    if (product && window.wishlistManager) {
      // Set initial state
      const isInWishlist = window.wishlistManager.has(productId);
      btn.classList.toggle("active", isInWishlist);
      btn.querySelector(".wishlist-icon").textContent = isInWishlist
        ? "❤️"
        : "🤍";

      // Add click handler
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.wishlistManager.toggle(product);
      });
    }
  });
}

// Render testimonials
function renderTestimonials() {
  const testimonialsGrid = document.getElementById("testimonialsGrid");
  if (!testimonialsGrid) return;

  const testimonials = [
    {
      name: "Alexander Wijaya",
      role: "Collector",
      content:
        "The quality is exceptional. Every piece feels like it was made just for me. The attention to detail is remarkable.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Isabella Chen",
      role: "Fashion Consultant",
      content:
        "G&M Store has become my go-to for premium accessories. Their curation is impeccable and the service is world-class.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Michael Hartono",
      role: "Business Executive",
      content:
        "The personalized attention I received was beyond expectations. Truly a premium experience from start to finish.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=3",
    },
  ];

  testimonialsGrid.innerHTML = "";

  testimonials.forEach((t, index) => {
    const stars = "★".repeat(t.rating) + "☆".repeat(5 - t.rating);
    const card = document.createElement("div");
    card.className = "testimonial-card";
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
            <div class="testimonial-rating">${stars}</div>
            <p class="testimonial-content">"${t.content}"</p>
            <div class="testimonial-author">
                <img src="${t.image}" alt="${t.name}" class="author-image" loading="lazy">
                <div>
                    <h4>${t.name}</h4>
                    <span>${t.role}</span>
                </div>
            </div>
        `;

    testimonialsGrid.appendChild(card);
  });
}

// Render Instagram grid
function renderInstagramGrid() {
  const instagramGrid = document.getElementById("instagramGrid");
  if (!instagramGrid) return;

  const products = window.products || [];
  const instagramPosts = products.slice(0, 6);

  instagramGrid.innerHTML = "";

  instagramPosts.forEach((post, index) => {
    const item = document.createElement("div");
    item.className = "instagram-item";
    item.style.animationDelay = `${index * 0.1}s`;

    item.innerHTML = `
            <img src="image/${post.image}" 
                 alt="Instagram post ${index + 1}" 
                 loading="lazy"
                 onerror="this.src='image/placeholder.jpg'">
            <div class="instagram-overlay">
                <span>❤️ ${Math.floor(Math.random() * 5000) + 1000}</span>
                <span>💬 ${Math.floor(Math.random() * 500) + 50}</span>
            </div>
        `;

    instagramGrid.appendChild(item);
  });
}

// Initialize collection tabs
function initCollectionTabs() {
  const tabs = document.querySelectorAll(".collection-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update active state
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Get category and render
      const category = tab.getAttribute("data-category");
      renderFeaturedProducts(category);

      // Show toast
      if (window.showToast) {
        const categoryName = category === "all" ? "All Products" : category;
        window.showToast(`Showing: ${categoryName}`, "info");
      }
    });
  });
}

// Initialize scroll indicator
function initScrollIndicator() {
  const indicator = document.querySelector(".scroll-indicator");
  if (!indicator) return;

  indicator.addEventListener("click", () => {
    const featured = document.getElementById("featured");
    if (featured) {
      featured.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Initialize parallax effect
function initParallax() {
  const parallaxElements = document.querySelectorAll("[data-parallax]");

  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrollY = window.scrollY;

      parallaxElements.forEach((el) => {
        const speed = el.dataset.parallaxSpeed || 0.5;
        const yPos = -(scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    }, 10),
  );
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  console.log("Home page loaded");

  // Initialize Three.js after preloader
  if (document.getElementById("three-canvas")) {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(() => {
        preloader.style.opacity = "0";
        setTimeout(() => {
          preloader.style.visibility = "hidden";
          initThree();
          document.body.classList.add("loaded");
        }, 800);
      }, 2000);
    } else {
      initThree();
    }
  }

  // Render components
  renderFeaturedProducts("all");
  renderTestimonials();
  renderInstagramGrid();

  // Initialize interactions
  initCollectionTabs();
  initScrollIndicator();
  initParallax();

  // Add wishlist buttons to existing cards
  setTimeout(addWishlistButtons, 1000);
});

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  // Clean up Three.js if needed
  const canvas = document.getElementById("three-canvas");
  if (canvas) {
    canvas.innerHTML = "";
  }
});
