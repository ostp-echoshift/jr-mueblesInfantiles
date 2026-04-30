/**
 * cart-logic.js
 * Gestión completa del carrito de compras para jr-mueblesInfantiles
 */
document.addEventListener('DOMContentLoaded', () => {
  // 📦 Estado del carrito (persistencia con localStorage)
  let cart = JSON.parse(localStorage.getItem('imjr_cart')) || [];

  // 🔍 Referencias al DOM
  const cartItemsEl = document.getElementById('cart-items');
  const totalAmountEl = document.getElementById('total-amount');
  const cartCountEl = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('whatsapp-checkout');
  const closeCartBtn = document.querySelector('.close-cart');
  const productsContainer = document.getElementById('products-container');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // 📋 Catálogo base (reemplazar por fetch/API si aplica)
  const products = [
    { id: 1, name: 'Cuna Clásica', price: 2500, category: 'cunas', image: 'assets/img/productos/cuna.jpg' },
    { id: 2, name: 'Cómoda Infantil', price: 1800, category: 'comodas', image: 'assets/img/productos/INFANTILES/infantiles01.jpg' },
    { id: 3, name: 'Cambiador Modular', price: 1200, category: 'accesorios', image: 'assets/img/productos/INFANTILES/infantiles04.jpg' },
    { id: 4, name: 'Cama Litera', price: 4500, category: 'camas', image: 'assets/img/productos/INFANTILES/infantiles03.jpg' }
  ];

  // 🎨 Renderizar productos con filtro
  function renderProducts(filter = 'all') {
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    productsContainer.innerHTML = filtered.map(p => `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f4f4f4%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23888%22 font-size=%2210%22%3ESin imagen%3C/text%3E%3C/svg%3E'}">
        <h3>${p.name}</h3>
        <p class="price">$${p.price.toLocaleString('es-MX')}</p>
        <button class="add-to-cart" data-id="${p.id}">Agregar al carrito</button>
      </div>
    `).join('');

    // Vincular botones de agregar
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
    });
  }

  // 🛒 Actualizar interfaz del carrito
  function updateCartUI() {
    cartItemsEl.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="empty-cart">Carrito vacío</p>';
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = '0.5';
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
      
      cart.forEach(item => {
        total += item.price * item.qty;
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
          <span>${item.name} (x${item.qty})</span>
          <span>$${(item.price * item.qty).toLocaleString('es-MX')}</span>
          <button class="remove-item" data-id="${item.id}">✕</button>
        `;
        cartItemsEl.appendChild(el);
      });

      document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
      });
    }

    totalAmountEl.textContent = total.toLocaleString('es-MX');
    cartCountEl.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
    localStorage.setItem('imjr_cart', JSON.stringify(cart));
  }

  // ➕ Agregar producto
  function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);
    existing ? existing.qty++ : cart.push({ ...product, qty: 1 });
    updateCartUI();
  }

  // ➖ Eliminar producto
  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
  }

  // 📲 Generar enlace de WhatsApp
  function sendToWhatsApp() {
    if (cart.length === 0) return;
    
    let message = '🛒 *Nuevo Pedido - JR Muebles Infantiles*\n\n';
    cart.forEach(item => {
      message += `▪️ ${item.name} x${item.qty} → $${(item.price * item.qty).toLocaleString('es-MX')}\n`;
    });
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    message += `\n💰 *Total: $${total.toLocaleString('es-MX')}*`;

    const phone = '523334866318'; // Formato internacional
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // 🎛️ Event Listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });

  if (checkoutBtn) checkoutBtn.addEventListener('click', sendToWhatsApp);
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => {
    document.querySelector('.cart-container').style.display = 'none';
  });

  // 🚀 Inicialización
  renderProducts();
  updateCartUI();
});