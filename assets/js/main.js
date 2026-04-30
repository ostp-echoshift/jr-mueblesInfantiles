// ================================================================
// main.js -- IMJR-WEB Core JS
// OSTP @echoShift  |  Pipeline: Leviatan
// ================================================================
'use strict';

const IMJR = {
  config:    null,
  productos: null,
  equipo:    null,

  init: async function () {
    await this.loadData();
    this.renderProductos('productos-grid',     6);
    this.renderProductos('productos-completos', 99);
    this.renderCatalogo('catalogo-table');
    this.renderEquipo('equipo-grid');
    this.initNav();
  },

  loadData: async function () {
    try {
      const [cfg, prods, team] = await Promise.all([
        fetch('data/config.json').then(r => r.json()),
        fetch('data/productos.json').then(r => r.json()),
        fetch('data/equipo.json').then(r => r.json())
      ]);
      this.config    = cfg;
      this.productos = prods;
      this.equipo    = team;
    } catch (e) {
      console.warn('[IMJR] data load error:', e);
    }
  },

  renderProductos: function (id, limit) {
    const el = document.getElementById(id);
    if (!el || !this.productos) return;
    el.innerHTML = this.productos
      .filter(p => p.visible !== false)
      .slice(0, limit)
      .map(p => `
        <div class="vz-service-card">
          <span class="vz-service-cat vz-cat-${p.categoria}">${p.categoria}</span>
          <div class="vz-service-name">${p.nombre}</div>
          <div class="vz-service-desc">${p.descripcion}</div>
          ${p.precio
            ? `<div class="vz-service-price">MX&#36;${p.precio.toLocaleString()}</div>`
            : `<div class="vz-service-price-free">Precio a consultar</div>`
          }
          <a href="https://wa.me/${this.config ? this.config.whatsapp : '523334866318'}?text=${encodeURIComponent('Hola, quiero información sobre ' + p.nombre)}" class="vz-btn-secondary" style="font-size:12px;margin-top:8px" target="_blank" rel="noopener">Consultar por WhatsApp</a>
        </div>
      `).join('');
  },

  renderCatalogo: function (id) {
    const el = document.getElementById(id);
    if (!el || !this.productos) return;
    const cats = [...new Set(this.productos.map(p => p.categoria))];
    el.innerHTML = cats.map(cat => `
      <div style="margin-bottom:var(--vz-sp-lg)">
        <h3 class="vz-h3" style="text-transform:capitalize;border-bottom:1px solid var(--vz-border);padding-bottom:8px;margin-bottom:16px">${cat}</h3>
        <div class="vz-grid-2">
          ${this.productos.filter(p => p.categoria === cat && p.visible).map(p => `
            <div class="vz-service-card">
              <div class="vz-service-name">${p.nombre}</div>
              <div class="vz-service-desc">${p.descripcion}</div>
              ${p.precio ? `<div class="vz-service-price">MX&#36;${p.precio.toLocaleString()}</div>` : `<div class="vz-service-price-free">Consultar precio</div>`}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  renderEquipo: function (id) {
    const el = document.getElementById(id);
    if (!el || !this.equipo) return;
    el.innerHTML = this.equipo.map(p => `
      <div class="vz-card">
        <div class="vz-h3">${p.nombre}</div>
        <div class="vz-muted" style="font-size:13px;margin-top:4px">${p.rol}</div>
        <div style="font-size:14px;margin-top:8px;color:var(--vz-text-muted)">${p.especialidad}</div>
      </div>
    `).join('');
  },

  initNav: function () {
    const burger = document.getElementById('nav-burger');
    const menu   = document.getElementById('nav-menu');
    if (burger && menu) {
      burger.addEventListener('click', () => menu.classList.toggle('open'));
    }
  }
};

document.addEventListener('DOMContentLoaded', () => IMJR.init());
