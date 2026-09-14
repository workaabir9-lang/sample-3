const config = window.STUDIO_CONFIG || {};

const buildWhatsAppLink = () => {
  const encodedMessage = encodeURIComponent(config.waMessage || 'Hello! I would like to enquire about your services.');
  const phone = (config.whatsapp || '').replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

const setTextContent = (selector, value) => {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
};

const setAttribute = (selector, attribute, value) => {
  const node = document.querySelector(selector);
  if (node) node.setAttribute(attribute, value);
};

const formatStars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);

const renderGlobalContent = () => {
  setTextContent('.studio-name', config.studioName || 'Studio Name');
  setTextContent('.studio-name-footer', config.studioName || 'Studio Name');
  setTextContent('.studio-phone', config.phone || '+92 300 0000000');
  setTextContent('.studio-email', config.email || 'hello@studio.com');
  setTextContent('.studio-address', config.address || 'Karachi, Pakistan');

  document.querySelectorAll('[data-wa-link]').forEach((link) => {
    link.href = buildWhatsAppLink();
  });

  document.querySelectorAll('[data-phone-link]').forEach((link) => {
    link.href = `tel:${(config.phone || '').replace(/\s+/g, '')}`;
  });

  document.querySelectorAll('[data-email-link]').forEach((link) => {
    link.href = `mailto:${config.email || 'hello@studio.com'}`;
  });

  const instagramLink = config.instagram || '#';
  setAttribute('[data-instagram-link]', 'href', instagramLink);
  setAttribute('[data-facebook-link]', 'href', config.facebook || '#');
  setAttribute('[data-youtube-link]', 'href', config.youtube || '#');

  const currentPage = document.body.dataset.page || 'home';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `${currentPage}.html` || (currentPage === 'home' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
};

const renderServices = () => {
  const target = document.querySelector('#services-grid');
  if (!target || !Array.isArray(config.services)) return;

  target.innerHTML = config.services.map((service) => `
    <article class="service-card reveal">
      <img src="${service.image}" alt="${service.name} by ${config.studioName}" loading="lazy" />
      <div class="card-body">
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <div class="card-meta">
          <span class="text-gold">Premium coverage</span>
          <a href="services.html" class="link-arrow">View Details →</a>
        </div>
      </div>
    </article>
  `).join('');
};

const renderWeddingsSection = () => {
  const target = document.querySelector('#event-grid');
  if (!target || !Array.isArray(config.weddingEvents)) return;

  target.innerHTML = config.weddingEvents.map((event) => `
    <article class="event-tile reveal">
      <img src="${event.image}" alt="${event.name} wedding event" loading="lazy" />
      <div class="overlay">
        <h3>${event.name}</h3>
      </div>
    </article>
  `).join('');
};

const renderPortfolio = () => {
  const target = document.querySelector('#portfolio-grid');
  const filterTarget = document.querySelector('#portfolio-filters');
  if (!target || !Array.isArray(config.portfolio)) return;

  const categories = ['All', ...new Set(config.portfolio.map((item) => item.category))];

  if (filterTarget) {
    filterTarget.innerHTML = categories.map((category, index) => `
      <button class="filter-btn ${index === 0 ? 'active' : ''}" type="button" data-filter="${category}">${category}</button>
    `).join('');
  }

  const renderItems = (selected = 'All') => {
    const filtered = selected === 'All' ? config.portfolio : config.portfolio.filter((item) => item.category === selected);
    target.innerHTML = filtered.map((item) => `
      <article class="gallery-item reveal" data-category="${item.category}" data-title="${item.title}" data-image="${item.image}">
        <img src="${item.image}" alt="${item.alt}" loading="lazy" />
        <div class="caption">
          <strong>${item.title}</strong>
          <span>${item.category}</span>
        </div>
      </article>
    `).join('');

    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        openPortfolioModal(item.dataset.image, item.dataset.title, item.dataset.category);
      });
    });
  };

  renderItems();

  filterTarget?.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      filterTarget.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      renderItems(button.dataset.filter);
    });
  });
};

const renderFeaturedStories = () => {
  const target = document.querySelector('#featured-projects');
  if (!target || !Array.isArray(config.featuredStories)) return;

  target.innerHTML = config.featuredStories.map((story) => `
    <article class="story-card reveal">
      <img src="${story.cover}" alt="${story.name} wedding story" loading="lazy" />
      <div class="card-body">
        <h3>${story.name}</h3>
        <p>${story.eventType} • ${story.location}</p>
        <p>${story.story}</p>
        <div class="meta">
          <span>${story.eventType}</span>
          <button class="btn btn-secondary view-story" type="button" data-story="${story.name}">View Story</button>
        </div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.view-story').forEach((button) => {
    button.addEventListener('click', () => {
      const story = config.featuredStories.find((item) => item.name === button.dataset.story);
      if (story) openStoryModal(story);
    });
  });
};

const renderPackages = () => {
  const target = document.querySelector('#package-list');
  if (!target || !Array.isArray(config.packages)) return;

  target.innerHTML = config.packages.map((pkg) => `
    <article class="package-card ${pkg.popular ? 'popular' : ''} reveal">
      <span class="tag">${pkg.popular ? 'Most Popular' : 'Package'}</span>
      <h3>${pkg.name}</h3>
      <div class="package-price">${pkg.price}</div>
      <p>${pkg.description}</p>
      <ul>
        ${pkg.features.map((feature) => `<li>${feature}</li>`).join('')}
      </ul>
      <a href="contact.html" class="btn btn-primary">Book Now</a>
    </article>
  `).join('');
};

const renderTestimonials = () => {
  const target = document.querySelector('#testimonial-slider');
  if (!target || !Array.isArray(config.testimonials)) return;

  target.innerHTML = config.testimonials.map((testimonial) => `
    <article class="review-card reveal">
      <div class="person">
        <img src="${testimonial.avatar}" alt="${testimonial.name} client portrait" loading="lazy" />
        <div>
          <strong>${testimonial.name}</strong>
          <p>${testimonial.event}</p>
        </div>
      </div>
      <div class="stars" aria-label="${testimonial.rating} out of 5 stars">${formatStars(testimonial.rating)}</div>
      <p>"${testimonial.review}"</p>
    </article>
  `).join('');
};

const renderCities = () => {
  const target = document.querySelector('#city-list');
  if (!target || !Array.isArray(config.locations)) return;

  target.innerHTML = config.locations.map((city) => `
    <article class="city-card reveal">
      <span class="eyebrow">Service area</span>
      <strong>${city}</strong>
    </article>
  `).join('');
};

const renderInstagram = () => {
  const target = document.querySelector('#instagram-grid');
  if (!target || !Array.isArray(config.portfolio)) return;

  const picks = config.portfolio.slice(0, 8);
  target.innerHTML = picks.map((item) => `
    <article class="instagram-card reveal">
      <img src="${item.image}" alt="${item.alt}" loading="lazy" />
      <div class="overlay">
        <span>${item.title}</span>
        <span>♡</span>
      </div>
    </article>
  `).join('');
};

const renderStats = () => {
  const target = document.querySelector('#stat-grid');
  if (!target || !Array.isArray(config.stats)) return;

  target.innerHTML = config.stats.map((stat) => `
    <div class="stat-box reveal">
      <strong data-count="${stat.number}">${stat.number}</strong>
      <span>${stat.label}</span>
    </div>
  `).join('');
};

const openStoryModal = (story) => {
  const modal = document.querySelector('#story-modal');
  if (!modal || !story) return;

  modal.classList.add('open');
  modal.querySelector('.modal-image img').src = story.cover;
  modal.querySelector('.modal-image img').alt = `${story.name} wedding story`;
  modal.querySelector('.modal-body h3').textContent = `${story.name} — ${story.eventType}`;
  modal.querySelector('.modal-body .story-description').textContent = story.story;
  modal.querySelector('.modal-body .story-meta').innerHTML = `
    <span>${story.location}</span>
    <span>${story.eventType}</span>
  `;

  const gallery = modal.querySelector('.story-gallery');
  if (gallery && Array.isArray(story.slides)) {
    gallery.innerHTML = story.slides.map((slide) => `
      <img src="${slide}" alt="${story.name} wedding moment" loading="lazy" />
    `).join('');
  }
};

const openPortfolioModal = (image, title, category) => {
  const modal = document.querySelector('#portfolio-modal');
  if (!modal) return;

  modal.classList.add('open');
  modal.querySelector('.portfolio-modal-image').src = image;
  modal.querySelector('.portfolio-modal-image').alt = title;
  modal.querySelector('.portfolio-modal-title').textContent = title;
  modal.querySelector('.portfolio-modal-category').textContent = category;
};

const initModals = () => {
  document.querySelectorAll('.modal-close').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.modal, .portfolio-modal').forEach((modal) => modal.classList.remove('open'));
    });
  });

  document.querySelectorAll('.modal, .portfolio-modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.classList.remove('open');
    });
  });
};

const initMobileNav = () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => nav.classList.toggle('open'));

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
};

const initRevealAnimations = () => {
  const revealItems = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => observer.observe(item));
};

const initBackToTop = () => {
  const button = document.querySelector('#back-to-top');
  if (!button) return;

  const toggleButton = () => {
    button.classList.toggle('visible', window.scrollY > 300);
  };

  toggleButton();
  window.addEventListener('scroll', toggleButton);
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

const initFormValidation = () => {
  const form = document.querySelector('#booking-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = '#d85555';
        isValid = false;
      } else {
        field.style.borderColor = 'rgba(27, 26, 24, 0.12)';
      }
    });

    if (!isValid) {
      alert('Please complete all required fields before submitting your inquiry.');
      return;
    }

    alert('Thank you! Your inquiry has been received. Our team will contact you soon.');
    form.reset();
  });
};

const setCurrentYear = () => {
  const yearNode = document.querySelector('#current-year');
  if (yearNode) yearNode.textContent = new Date().getFullYear();
};

document.addEventListener('DOMContentLoaded', () => {
  renderGlobalContent();
  renderServices();
  renderWeddingsSection();
  renderPortfolio();
  renderFeaturedStories();
  renderPackages();
  renderTestimonials();
  renderCities();
  renderInstagram();
  renderStats();
  initMobileNav();
  initRevealAnimations();
  initBackToTop();
  initFormValidation();
  initModals();
  setCurrentYear();
});
