document.addEventListener("DOMContentLoaded", () => {
  console.log("About page loaded");

  initValueItems();
  initTimeline();
  initTeamMembers();
});

function initValueItems() {
  const valueItems = document.querySelectorAll(".value-item");

  valueItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.classList.add("fade-in");

    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateY(-10px)";
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateY(0)";
    });
  });
}

function initTimeline() {
  const timelineItems = [
    {
      year: "2020",
      title: "The Beginning",
      description:
        "G&M Store was founded with a vision to bring premium elegance to discerning customers.",
    },
    {
      year: "2021",
      title: "First Collection",
      description:
        "Launched our signature collection, receiving critical acclaim and customer praise.",
    },
    {
      year: "2022",
      title: "International Expansion",
      description:
        "Expanded our reach to serve customers across Southeast Asia.",
    },
    {
      year: "2023",
      title: "Limited Edition Series",
      description:
        "Introduced limited edition pieces, collaborating with renowned artisans.",
    },
    {
      year: "2024",
      title: "Digital Innovation",
      description:
        "Enhanced online experience with virtual consultations and personalized services.",
    },
    {
      year: "2025",
      title: "The Future",
      description:
        "Continuing our journey of excellence and innovation in luxury.",
    },
  ];

  const timelineContainer = document.querySelector(".timeline");
  if (!timelineContainer) return;

  timelineContainer.innerHTML = "";

  timelineItems.forEach((item, index) => {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    timelineItem.style.animationDelay = `${index * 0.1}s`;

    const title = window.i18n
      ? window.i18n.t(`about.timeline.title${index}`)
      : item.title;
    const description = window.i18n
      ? window.i18n.t(`about.timeline.desc${index}`)
      : item.description;

    timelineItem.innerHTML = `
            <div class="timeline-year">${item.year}</div>
            <div class="timeline-content">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;

    timelineContainer.appendChild(timelineItem);
  });
}

function initTeamMembers() {
  const teamMembers = [
    {
      name: "Michael Gunawan",
      role: "Founder & CEO",
      bio: "With over 15 years in luxury retail, Michael brings passion and expertise to every collection.",
      image: "https://i.pravatar.cc/300?img=4",
    },
    {
      name: "Sarah Wijaya",
      role: "Creative Director",
      bio: "Award-winning designer curating our exclusive collections with an eye for timeless elegance.",
      image: "https://i.pravatar.cc/300?img=5",
    },
    {
      name: "David Chen",
      role: "Head of Operations",
      bio: "Ensuring every piece meets our exacting standards before reaching our discerning clients.",
      image: "https://i.pravatar.cc/300?img=6",
    },
  ];

  const teamContainer = document.querySelector(".team-grid");
  if (!teamContainer) return;

  teamContainer.innerHTML = "";

  teamMembers.forEach((member, index) => {
    const memberCard = document.createElement("div");
    memberCard.className = "team-card";
    memberCard.style.animationDelay = `${index * 0.1}s`;

    const name = window.i18n
      ? window.i18n.t(`about.team.name${index}`)
      : member.name;
    const role = window.i18n
      ? window.i18n.t(`about.team.role${index}`)
      : member.role;
    const bio = window.i18n
      ? window.i18n.t(`about.team.bio${index}`)
      : member.bio;

    memberCard.innerHTML = `
            <div class="team-image">
                <img src="${member.image}" alt="${name}" loading="lazy">
                <div class="team-social">
                    <a href="#" class="social-icon">in</a>
                    <a href="#" class="social-icon">ig</a>
                    <a href="#" class="social-icon">tw</a>
                </div>
            </div>
            <div class="team-info">
                <h3>${name}</h3>
                <span class="team-role">${role}</span>
                <p class="team-bio">${bio}</p>
            </div>
        `;

    teamContainer.appendChild(memberCard);
  });
}

const aboutStyle = document.createElement("style");
aboutStyle.textContent = `
    .value-item {
        opacity: 0;
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .timeline-section {
        padding: 80px 0;
        background: var(--black);
    }
    
    .timeline {
        position: relative;
        padding: 40px 0;
    }
    
    .timeline::before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 100%;
        background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    }
    
    .timeline-item {
        display: flex;
        align-items: center;
        gap: 40px;
        margin-bottom: 60px;
        opacity: 0;
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .timeline-item:nth-child(even) {
        flex-direction: row-reverse;
    }
    
    .timeline-year {
        flex: 1;
        text-align: right;
        font-size: 2rem;
        font-weight: 300;
        color: var(--gold);
    }
    
    .timeline-item:nth-child(even) .timeline-year {
        text-align: left;
    }
    
    .timeline-content {
        flex: 1;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 25px;
        transition: var(--transition-base);
    }
    
    .timeline-content:hover {
        border-color: var(--gold);
        transform: translateY(-5px);
    }
    
    .timeline-content h3 {
        color: var(--white);
        margin-bottom: 10px;
        font-size: 1.3rem;
    }
    
    .timeline-content p {
        color: #999;
        line-height: 1.6;
    }
    
    .team-section {
        padding: 80px 0;
        background: var(--black-light);
    }
    
    .team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 50px;
    }
    
    .team-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        overflow: hidden;
        transition: var(--transition-base);
        opacity: 0;
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .team-card:hover {
        transform: translateY(-10px);
        border-color: var(--gold);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .team-image {
        position: relative;
        overflow: hidden;
        aspect-ratio: 1;
    }
    
    .team-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    .team-card:hover .team-image img {
        transform: scale(1.05);
    }
    
    .team-social {
        position: absolute;
        bottom: -50px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        gap: 15px;
        padding: 20px;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        transition: bottom 0.3s ease;
    }
    
    .team-card:hover .team-social {
        bottom: 0;
    }
    
    .team-social .social-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--gold);
        color: var(--black);
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-weight: bold;
        transition: var(--transition-base);
    }
    
    .team-social .social-icon:hover {
        transform: scale(1.1);
        background: var(--gold-light);
    }
    
    .team-info {
        padding: 25px;
    }
    
    .team-info h3 {
        color: var(--white);
        margin-bottom: 5px;
        font-size: 1.3rem;
    }
    
    .team-role {
        display: inline-block;
        color: var(--gold);
        font-size: 0.9rem;
        margin-bottom: 15px;
    }
    
    .team-bio {
        color: #999;
        line-height: 1.6;
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
    
    @media (max-width: 768px) {
        .timeline::before {
            left: 30px;
        }
        
        .timeline-item,
        .timeline-item:nth-child(even) {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
        }
        
        .timeline-year {
            text-align: left;
        }
        
        .timeline-item:nth-child(even) .timeline-year {
            text-align: left;
        }
        
        .team-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(aboutStyle);
