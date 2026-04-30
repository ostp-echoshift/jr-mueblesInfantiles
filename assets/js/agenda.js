// ================================================================
// agenda.js -- IMJR-WEB WhatsApp + Funnel
// OSTP @echoShift  |  Pipeline: Leviatan
// ================================================================
'use strict';

const IMJR_AGENDA = {
  WA: '5213334866318',

  link: function (producto, nombre, nota) {
    const parts = [
      'Hola Infantil & Muebles JR, quiero cotizar un producto.',
      producto ? 'Producto: ' + producto : '',
      nombre   ? 'Nombre: '  + nombre   : '',
      nota     ? 'Nota: '    + nota     : ''
    ].filter(Boolean);
    return 'https://wa.me/' + this.WA + '?text=' + encodeURIComponent(parts.join('\n'));
  },

  initFunnel: function () {
    // Placeholder para funnel de productos
    console.log('Funnel no implementado aún');
  },

  init: function () {
    setTimeout(() => this.initFunnel(), 300);
  }
};

document.addEventListener('DOMContentLoaded', () => IMJR_AGENDA.init());

