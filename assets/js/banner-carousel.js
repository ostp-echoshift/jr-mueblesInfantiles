// banner-carousel.js -- Carga dinámica de banners
const BannerCarousel = {
  banners: [],
  currentIndex: 0,
  autoplay: null,
  autoplayDelay: 5000,

  async init() {
    try {
      const res = await fetch('data/banners.json');
      if (!res.ok) throw new Error('Error cargando banners');
      
      this.banners = await res.json();
      this.banners = this.banners.filter(b => b.activo !== false);
      
      if (this.banners.length > 0) {
        this.render();
        this.startAutoplay();
        this.bindEvents();
      }
    } catch (err) {
      console.warn('[BannerCarousel] Fallback a banners estáticos:', err);
      this.renderFallback();
    }
  },

  render() {
    const track = document.getElementById('carouselTrack');
    const dots = document.getElementById('carouselDots');
    if (!track) return;

    track.innerHTML = this.banners.map((b, i) => `
      <div class="carousel-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
        <img src="${b.imagen}" alt="${b.titulo}" 
             onerror="this.closest('.carousel-slide').style.display='none'">
        <div class="carousel-caption">
          <h3>${b.titulo}</h3>
          <p>${b.subtitulo}</p>
          ${b.cta_enlace ? `<a href="${b.cta_enlace}" class="carousel-cta">${b.cta_texto || 'Ver más'}</a>` : ''}
        </div>
      </div>
    `).join('');

    if (dots) {
      dots.innerHTML = this.banners.map((_, i) => 
        `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Ir al banner ${i + 1}"></button>`
      ).join('');
    }
  },

  renderFallback() {
    // Fallback: escanea carpeta banners/ si falla JSON
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    // Genera slides con banners01.jpg...banner12.jpg
    let html = '';
    for (let i = 1; i <= 12; i++) {
      const img = `assets/img/banners/banner${String(i).padStart(2,'0')}.jpg`;
      html += `
        <div class="carousel-slide ${i===1?'active':''}">
          <img src="${img}" alt="Banner ${i}" onerror="this.closest('.carousel-slide').style.display='none'">
        </div>`;
    }
    track.innerHTML = html;
    this.bindEvents();
  },

  goTo(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    slides[index]?.classList.add('active');
    dots[index]?.classList.add('active');
    this.currentIndex = index;
    this.resetAutoplay();
  },

  next() {
    const nextIndex = (this.currentIndex + 1) % this.banners.length;
    this.goTo(nextIndex);
  },

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
    this.goTo(prevIndex);
  },

  startAutoplay() {
    if (this.banners.length > 1) {
      this.autoplay = setInterval(() => this.next(), this.autoplayDelay);
    }
  },

  resetAutoplay() {
    clearInterval(this.autoplay);
    this.startAutoplay();
  },

  bindEvents() {
    document.getElementById('prevBtn')?.addEventListener('click', () => this.prev());
    document.getElementById('nextBtn')?.addEventListener('click', () => this.next());
    
    document.getElementById('carouselDots')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('carousel-dot')) {
        this.goTo(parseInt(e.target.dataset.index));
      }
    });

    // Pausar autoplay al hacer hover
    const carousel = document.getElementById('bannerCarousel');
    carousel?.addEventListener('mouseenter', () => clearInterval(this.autoplay));
    carousel?.addEventListener('mouseleave', () => this.startAutoplay());
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bannerCarousel')) {
    BannerCarousel.init();
  }
});