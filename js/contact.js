document.addEventListener("DOMContentLoaded", () => {
  console.log("Contact page loaded");

  initContactForm();
  initMap();
  initContactCards();
});

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const waNumber = document.getElementById("waNumber")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const inquiryType = document.getElementById("inquiryType")?.value;
    const message = document.getElementById("message")?.value.trim();

    if (!name || !waNumber || !message) {
      window.showToast?.("Please fill in all required fields", "error");
      return;
    }

    if (!window.helpers?.isValidPhone(waNumber)) {
      window.showToast?.("Please enter a valid WhatsApp number", "error");
      return;
    }

    if (email && !window.helpers?.isValidEmail(email)) {
      window.showToast?.("Please enter a valid email address", "error");
      return;
    }

    const whatsappMessage = `
*New Inquiry from G&M Store Website*

*Name:* ${name}
*WhatsApp:* ${waNumber}
*Email:* ${email || "Not provided"}
*Inquiry Type:* ${inquiryType || "General"}
*Message:*
${message}
        `.trim();

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/6285811139858?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener noreferrer");

    window.showToast?.("Redirecting to WhatsApp...", "success");

    const formData = {
      name,
      waNumber,
      email,
      inquiryType,
      message,
      timestamp: new Date().toISOString(),
    };
    const savedForms = JSON.parse(localStorage.getItem("contactForms") || "[]");
    savedForms.push(formData);
    localStorage.setItem("contactForms", JSON.stringify(savedForms.slice(-10)));

    form.reset();
  });

  const waInput = document.getElementById("waNumber");
  if (waInput) {
    waInput.addEventListener(
      "input",
      window.helpers?.debounce(() => {
        if (waInput.value && !window.helpers?.isValidPhone(waInput.value)) {
          waInput.classList.add("error");
        } else {
          waInput.classList.remove("error");
        }
      }, 500),
    );
  }

  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener(
      "input",
      window.helpers?.debounce(() => {
        if (
          emailInput.value &&
          !window.helpers?.isValidEmail(emailInput.value)
        ) {
          emailInput.classList.add("error");
        } else {
          emailInput.classList.remove("error");
        }
      }, 500),
    );
  }
}

function initContactCards() {
  const contactCards = document.querySelectorAll(".contact-card");

  contactCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add("fade-in");

    card.addEventListener("click", (e) => {
      const link = card.querySelector("a");
      if (link && !e.target.closest("a")) {
        link.click();
      }
    });
  });
}

function initMap() {
  const mapPlaceholder = document.querySelector(".map-placeholder");
  if (!mapPlaceholder) return;

  mapPlaceholder.addEventListener("click", () => {
    const location = "Plaza+Indonesia,+Jakarta";
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${location}`;
    window.open(mapUrl, "_blank", "noopener noreferrer");
  });

  mapPlaceholder.addEventListener("mouseenter", () => {
    mapPlaceholder.style.transform = "scale(1.02)";
  });

  mapPlaceholder.addEventListener("mouseleave", () => {
    mapPlaceholder.style.transform = "scale(1)";
  });
}

const contactStyle = document.createElement("style");
contactStyle.textContent = `
    .contact-card {
        opacity: 0;
        animation: fadeInUp 0.6s ease forwards;
        cursor: pointer;
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .contact-card a {
        pointer-events: none;
    }
    
    .contact-card:hover .contact-icon {
        background: var(--gold);
        color: var(--black);
    }
    
    #waNumber.error,
    #email.error {
        border-bottom-color: #ff4444;
    }
    
    .form-error-message {
        color: #ff4444;
        font-size: 0.8rem;
        margin-top: -20px;
        margin-bottom: 20px;
    }
    
    .contact-success-message {
        text-align: center;
        padding: 40px;
        background: rgba(76, 175, 80, 0.1);
        border: 1px solid #4caf50;
        border-radius: 12px;
        margin-top: 20px;
    }
    
    .contact-success-message h3 {
        color: #4caf50;
        margin-bottom: 10px;
    }
    
    .contact-success-message p {
        color: #999;
    }
    
    .business-hours {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(198, 164, 92, 0.15);
        border-radius: 16px;
        padding: 25px;
        margin: 30px 0;
        transition: all 0.3s ease;
    }
    
    .business-hours:hover {
        border-color: var(--gold);
        box-shadow: 0 10px 30px rgba(198, 164, 92, 0.1);
    }
    
    .business-hours h3 {
        color: var(--white);
        font-size: 1.2rem;
        font-weight: 400;
        letter-spacing: 1px;
        margin-bottom: 20px;
        position: relative;
        display: inline-block;
    }
    
    .business-hours h3::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 30px;
        height: 2px;
        background: var(--gold);
    }
    
    .hours-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 15px;
    }
    
    .hours-item {
        display: flex;
        flex-direction: column;
        padding: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        border-left: 3px solid var(--gold);
        transition: all 0.3s ease;
    }
    
    .hours-item:hover {
        background: rgba(198, 164, 92, 0.1);
        transform: translateY(-2px);
    }
    
    .hours-item .day {
        color: var(--gold);
        font-size: 0.85rem;
        font-weight: 500;
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .hours-item .time {
        color: var(--white);
        font-size: 1rem;
        font-weight: 400;
    }
    
    .hours-item .closed {
        color: #ff6b6b;
    }
    
    .hours-item .appointment {
        color: #4ecdc4;
    }
    
    .hours-note {
        color: #999;
        font-size: 0.85rem;
        font-style: italic;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        text-align: center;
        letter-spacing: 0.5px;
    }
    
    .contact-details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .contact-details-col {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    body.light-theme .business-hours {
        background: rgba(0, 0, 0, 0.02);
        border-color: rgba(198, 164, 92, 0.3);
    }
    
    body.light-theme .business-hours h3 {
        color: var(--black);
    }
    
    body.light-theme .hours-item {
        background: rgba(0, 0, 0, 0.03);
    }
    
    body.light-theme .hours-item .time {
        color: var(--black);
    }
    
    body.light-theme .hours-note {
        border-top-color: rgba(0, 0, 0, 0.1);
        color: #666;
    }
    
    @media (max-width: 768px) {
        .hours-grid {
            grid-template-columns: 1fr;
            gap: 10px;
        }
        
        .business-hours {
            padding: 20px;
            margin: 20px 0;
        }
        
        .hours-item {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
        
        .hours-item .day {
            margin-bottom: 0;
        }
        
        .contact-details-grid {
            grid-template-columns: 1fr;
            gap: 15px;
        }
    }
    
    @media (max-width: 480px) {
        .business-hours h3 {
            font-size: 1.1rem;
        }
    }
`;

document.head.appendChild(contactStyle);
