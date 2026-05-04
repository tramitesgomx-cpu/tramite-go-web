/* =========================================
   TRÁMITE GO - JavaScript completo
   Carrito + Evaluador + Promociones
   ========================================= */

const WHATSAPP_NUMBER = '5216645298312';
const COMPANY_EMAIL = 'tramitesgomx@gmail.com';

// Catálogo de servicios
const SERVICIOS = {
  'doble-nacionalidad': { nombre: 'Doble Nacionalidad', precio: 0, icono: '🌎' },
  'crba': { nombre: 'CRBA', precio: 0, icono: '📋' },
  'visa-humanitaria': { nombre: 'Visa Humanitaria', precio: 1700, icono: '💚' },
  'pasaporte-americano': { nombre: 'Pasaporte Americano', precio: 1300, icono: '🇺🇸' },
  'pasaporte-mexicano': { nombre: 'Pasaporte Mexicano', precio: 700, icono: '🇲🇽' },
  'sentri': { nombre: 'SENTRI / Global Entry', precio: 1300, icono: '🛂' },
  'visa-b1b2': { nombre: 'Visa Turista B1/B2', precio: 1300, icono: '🧳' },
  'pack-mex-visa': { nombre: 'Paquete: Pasaporte Mexicano + Visa B1/B2', precio: 1700, icono: '🎁' },
  'pack-visa-sentri': { nombre: 'Paquete: Visa B1/B2 + SENTRI', precio: 2000, icono: '🎁' }
};

// ========== MENÚ MÓVIL ==========
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
  });

  // Botón carrito
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', abrirCarrito);

  actualizarCarritoUI();
  console.log('%c🚀 Trámite GO cargado correctamente', 'color:#2D7873;font-size:14px;font-weight:bold;');
});

// ========== PROMOCIONES ROTATIVAS ==========
const PROMOCIONES = [
  { emoji: '🎉', text: '<strong>Promoción de lanzamiento:</strong> Evaluación inicial sin costo en cualquier trámite' },
  { emoji: '🚀', text: '<strong>¡Atención inmediata!</strong> Respondemos por WhatsApp en menos de 1 hora' },
  { emoji: '💚', text: '<strong>Visa Humanitaria:</strong> Asesoría completa con sensibilidad y profesionalismo' },
  { emoji: '🇲🇽', text: '<strong>Pasaporte Mexicano por solo $700 MXN</strong> · Trámite rápido y ordenado' },
  { emoji: '🛂', text: '<strong>SENTRI / Global Entry $1,300 MXN</strong> · Cruza la frontera más rápido' }
];

let promoIdx = 0;
setInterval(() => {
  const banner = document.getElementById('promoBanner');
  if (!banner) return;
  promoIdx = (promoIdx + 1) % PROMOCIONES.length;
  const p = PROMOCIONES[promoIdx];
  banner.style.opacity = '0';
  setTimeout(() => {
    banner.innerHTML = `<span>${p.emoji}</span> <span>${p.text}</span> <span>${p.emoji}</span>`;
    banner.style.transition = 'opacity 0.5s ease';
    banner.style.opacity = '1';
  }, 500);
}, 5000);

// ========== CARRITO DE COMPRA ==========
let carrito = JSON.parse(localStorage.getItem('tramitego_cart') || '[]');

function guardarCarrito() {
  localStorage.setItem('tramitego_cart', JSON.stringify(carrito));
  actualizarCarritoUI();
}

function agregarAlCarrito(servicioId) {
  const servicio = SERVICIOS[servicioId];
  if (!servicio) return;

  // Si solo tiene cotización personalizada, mandar a cotizar
  if (servicio.precio === 0) {
    cotizarServicio(servicioId);
    return;
  }

  const existe = carrito.find(item => item.id === servicioId);
  if (existe) {
    existe.cantidad += 1;
    mostrarToast(`✓ Cantidad actualizada: ${servicio.nombre}`);
  } else {
    carrito.push({ id: servicioId, ...servicio, cantidad: 1 });
    mostrarToast(`✓ ${servicio.nombre} agregado al carrito`);
  }
  guardarCarrito();
  setTimeout(() => abrirCarrito(), 600);
}

function quitarDelCarrito(servicioId) {
  carrito = carrito.filter(item => item.id !== servicioId);
  guardarCarrito();
  renderCarrito();
}

function cambiarCantidad(servicioId, delta) {
  const item = carrito.find(i => i.id === servicioId);
  if (!item) return;
  item.cantidad = Math.max(1, item.cantidad + delta);
  guardarCarrito();
  renderCarrito();
}

function calcularTotal() {
  return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

function actualizarCarritoUI() {
  const count = carrito.reduce((s, i) => s + i.cantidad, 0);
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
  }
}

function renderCarrito() {
  const container = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const footer = document.getElementById('cartFooter');

  if (carrito.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'block';
    footer.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  footer.style.display = 'block';

  container.innerHTML = carrito.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.icono}</div>
      <div class="cart-item-info">
        <h4>${item.nombre}</h4>
        <p class="cart-item-price">$${item.precio.toLocaleString('es-MX')} MXN</p>
        <div class="cart-item-controls">
          <button onclick="cambiarCantidad('${item.id}', -1)" class="qty-btn">−</button>
          <span class="qty-num">${item.cantidad}</span>
          <button onclick="cambiarCantidad('${item.id}', 1)" class="qty-btn">+</button>
          <button onclick="quitarDelCarrito('${item.id}')" class="remove-btn">🗑️ Quitar</button>
        </div>
      </div>
      <div class="cart-item-total">$${(item.precio * item.cantidad).toLocaleString('es-MX')}</div>
    </div>
  `).join('');

  document.getElementById('cartTotal').textContent = `$${calcularTotal().toLocaleString('es-MX')} MXN`;
}

function abrirCarrito() {
  renderCarrito();
  document.getElementById('cartModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  document.getElementById('cartModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ========== COTIZACIÓN (servicios sin precio fijo) ==========
function cotizarServicio(servicioId) {
  const servicio = SERVICIOS[servicioId];
  if (!servicio) return;
  const mensaje = encodeURIComponent(
    `Hola Trámite GO 👋\n\nMe interesa el servicio de *${servicio.nombre}* y quisiera solicitar una cotización personalizada.\n\n¿Podrían darme más información? Gracias.`
  );
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
}

// ========== CHECKOUT ==========
function abrirCheckout() {
  if (carrito.length === 0) return;
  cerrarCarrito();
  renderCheckoutResumen();
  document.getElementById('checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCheckoutResumen() {
  const items = document.getElementById('checkoutItems');
  items.innerHTML = carrito.map(item => `
    <div class="checkout-item">
      <span>${item.icono} ${item.nombre} ${item.cantidad > 1 ? `× ${item.cantidad}` : ''}</span>
      <strong>$${(item.precio * item.cantidad).toLocaleString('es-MX')} MXN</strong>
    </div>
  `).join('');
  document.getElementById('checkoutTotal').textContent = `$${calcularTotal().toLocaleString('es-MX')} MXN`;
}

function procesarPago(e) {
  e.preventDefault();
  const nombre = document.getElementById('ckNombre').value.trim();
  const whatsapp = document.getElementById('ckWhatsapp').value.trim();
  const correo = document.getElementById('ckCorreo').value.trim();
  const ciudad = document.getElementById('ckCiudad').value.trim();
  const notas = document.getElementById('ckNotas').value.trim();
  const metodo = document.querySelector('input[name="payment"]:checked').value;

  // Construir mensaje detallado
  let mensaje = `🛒 *NUEVA SOLICITUD - Trámite GO*\n\n`;
  mensaje += `👤 *Cliente:* ${nombre}\n`;
  mensaje += `📱 *WhatsApp:* ${whatsapp}\n`;
  mensaje += `📧 *Correo:* ${correo}\n`;
  mensaje += `📍 *Ciudad:* ${ciudad}\n\n`;
  mensaje += `📋 *Servicios solicitados:*\n`;
  carrito.forEach(item => {
    mensaje += `• ${item.nombre}${item.cantidad > 1 ? ` (×${item.cantidad})` : ''} — $${(item.precio * item.cantidad).toLocaleString('es-MX')} MXN\n`;
  });
  mensaje += `\n💰 *Total:* $${calcularTotal().toLocaleString('es-MX')} MXN\n`;
  mensaje += `💳 *Método de pago preferido:* ${metodo === 'whatsapp' ? 'Confirmación por WhatsApp' : 'Transferencia bancaria'}\n`;
  if (notas) mensaje += `\n📝 *Notas:* ${notas}\n`;
  mensaje += `\n¡Espero su confirmación! Gracias.`;

  // Guardar pedido localmente
  const pedido = {
    fecha: new Date().toISOString(),
    cliente: { nombre, whatsapp, correo, ciudad, notas },
    items: carrito,
    total: calcularTotal(),
    metodo
  };
  try {
    const pedidos = JSON.parse(localStorage.getItem('tramitego_pedidos') || '[]');
    pedidos.push(pedido);
    localStorage.setItem('tramitego_pedidos', JSON.stringify(pedidos));
  } catch(e) {}

  console.log('🟢 Nuevo pedido:', pedido);

  // Abrir WhatsApp con el mensaje
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');

  // Limpiar carrito y cerrar modal
  carrito = [];
  guardarCarrito();
  cerrarCheckout();
  mostrarToast('✅ ¡Solicitud enviada! Te contactaremos por WhatsApp.');
}

// ========== TOAST DE NOTIFICACIÓN ==========
function mostrarToast(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ========== EVALUADOR ==========
let userData = { nombre: '', whatsapp: '', correo: '', edad: '', ciudad: '', ocupacion: '', urgencia: '', servicio: '', respuestas: {} };
let currentStep = 1;

const PREGUNTAS = {
  'doble-nacionalidad': [
    { p: '¿Tienes algún familiar directo (padres, abuelos) con nacionalidad extranjera?', o: ['Sí', 'No estoy seguro', 'No'] },
    { p: '¿Cuentas con actas de nacimiento de tus familiares?', o: ['Sí, todas', 'Algunas', 'No tengo'] },
    { p: '¿Cuál es tu situación actual?', o: ['En México', 'En el extranjero', 'En proceso de mudanza'] }
  ],
  'crba': [
    { p: '¿Es tu hijo(a) menor de 18 años?', o: ['Sí', 'No'] },
    { p: '¿Al menos uno de los padres es ciudadano americano?', o: ['Sí', 'No', 'No estoy seguro'] },
    { p: '¿Cuentas con acta de nacimiento del menor?', o: ['Sí', 'En trámite', 'No'] }
  ],
  'visa-humanitaria': [
    { p: '¿Estás en una situación de vulnerabilidad o necesidad humanitaria?', o: ['Sí', 'Parcialmente', 'Necesito orientación'] },
    { p: '¿Cuentas con identificación oficial vigente?', o: ['Sí', 'En trámite', 'No'] },
    { p: '¿Has iniciado algún trámite migratorio antes?', o: ['Sí', 'No', 'Es mi primera vez'] }
  ],
  'pasaporte-americano': [
    { p: '¿Eres ciudadano americano?', o: ['Sí', 'En proceso', 'No'] },
    { p: '¿Es renovación o primer pasaporte?', o: ['Renovación', 'Primer pasaporte'] },
    { p: '¿Tienes tu pasaporte anterior (si aplica)?', o: ['Sí', 'Lo perdí', 'No aplica'] }
  ],
  'pasaporte-mexicano': [
    { p: '¿Tienes acta de nacimiento mexicana?', o: ['Sí', 'En trámite', 'No'] },
    { p: '¿Cuentas con identificación oficial (INE)?', o: ['Sí', 'En trámite', 'No'] },
    { p: '¿Es tu primer pasaporte o renovación?', o: ['Primer pasaporte', 'Renovación'] }
  ],
  'sentri': [
    { p: '¿Tienes pasaporte vigente?', o: ['Sí', 'En trámite', 'No'] },
    { p: '¿Tienes antecedentes migratorios o legales en EE.UU.?', o: ['No', 'Sí, menores', 'Sí, importantes'] },
    { p: '¿Cruzas la frontera con frecuencia?', o: ['Sí, varias veces al mes', 'Ocasionalmente', 'Pocas veces'] }
  ],
  'visa-b1b2': [
    { p: '¿Tienes pasaporte mexicano vigente?', o: ['Sí', 'En trámite', 'No'] },
    { p: '¿Tienes empleo o ingresos comprobables?', o: ['Sí, formal', 'Sí, informal', 'No'] },
    { p: '¿Es tu primera visa o renovación?', o: ['Primera vez', 'Renovación'] }
  ]
};

// Configurar listeners del evaluador
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#serviceOptions .option-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#serviceOptions .option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      userData.servicio = card.dataset.value;
    });
  });
});

function iniciarEvaluacion(servicioId) {
  // Ir al evaluador y pre-seleccionar el servicio
  document.getElementById('evaluador').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    userData.servicio = servicioId;
    document.querySelectorAll('#serviceOptions .option-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.value === servicioId);
    });
  }, 800);
}

function nextStep(step) {
  if (step === 1) {
    const nombre = document.getElementById('nombre').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const edad = document.getElementById('edad').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const ocupacion = document.getElementById('ocupacion').value.trim();
    const urgencia = document.getElementById('urgencia').value;

    if (!nombre || !whatsapp || !correo || !edad || !ciudad || !ocupacion || !urgencia) {
      mostrarToast('⚠️ Por favor completa todos los campos');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      mostrarToast('⚠️ Ingresa un correo válido');
      return;
    }
    if (parseInt(edad) < 1 || parseInt(edad) > 120) {
      mostrarToast('⚠️ Edad inválida');
      return;
    }
    userData.nombre = nombre;
    userData.whatsapp = whatsapp;
    userData.correo = correo;
    userData.edad = edad;
    userData.ciudad = ciudad;
    userData.ocupacion = ocupacion;
    userData.urgencia = urgencia;
  }
  if (step === 2) {
    if (!userData.servicio) {
      mostrarToast('⚠️ Selecciona un servicio para continuar');
      return;
    }
    cargarPreguntas();
  }
  goToStep(step + 1);
}

function prevStep(step) {
  goToStep(step - 1);
}

function goToStep(step) {
  document.querySelectorAll('.eval-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.eval-step[data-step="${step}"]`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.eval-progress-bar').forEach((bar, i) => {
    bar.classList.toggle('active', i < step);
  });

  currentStep = step;
  const card = document.getElementById('evaluatorCard');
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function cargarPreguntas() {
  const container = document.getElementById('dynamicQuestions');
  const qs = PREGUNTAS[userData.servicio] || [];
  userData.respuestas = {};
  container.innerHTML = qs.map((q, idx) => `
    <div class="form-group">
      <label>${idx + 1}. ${q.p}</label>
      <div class="option-group" data-q="${idx}">
        ${q.o.map(op => `<div class="option-card" data-value="${op}" onclick="seleccionarRespuesta(this, ${idx})">${op}</div>`).join('')}
      </div>
    </div>
  `).join('');
}

function seleccionarRespuesta(el, qIdx) {
  el.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  userData.respuestas[qIdx] = el.dataset.value;
  // Actualizar el href del botón "Ver resultado" en tiempo real
  actualizarHrefVerResultado();
}

// Construye y asigna la URL de WhatsApp al botón "Ver resultado"
// Se llama cada vez que el usuario responde una pregunta
function actualizarHrefVerResultado() {
  const btn = document.getElementById('btnVerResultado');
  if (!btn) return;

  const qs = PREGUNTAS[userData.servicio] || [];
  const respondidas = Object.keys(userData.respuestas).length;
  if (respondidas < qs.length) {
    btn.href = '#';
    btn.removeAttribute('target');
    return;
  }

  // Construir URL de WhatsApp
  const nombreServicio = (SERVICIOS[userData.servicio] && SERVICIOS[userData.servicio].nombre) || userData.servicio;
  const urgenciaTexto = {
    urgente: '🔴 URGENTE (próximas 2 semanas)',
    pronto: '🟠 Pronto (este mes)',
    planeando: '🟡 Planeando (1-3 meses)',
    explorando: '🟢 Solo explorando opciones'
  }[userData.urgencia] || userData.urgencia || 'No especificada';

  const respuestasTexto = qs.map((q, i) => `   • ${q.p}\n     → *${userData.respuestas[i]}*`).join('\n');

  const mensaje =
    `🎯 *NUEVO LEAD - Trámite GO*\n` +
    `━━━━━━━━━━━━━━━━━━━\n\n` +
    `👤 *DATOS DEL CLIENTE*\n` +
    `• Nombre: ${userData.nombre}\n` +
    `• WhatsApp: ${userData.whatsapp}\n` +
    `• Correo: ${userData.correo}\n` +
    `• Edad: ${userData.edad} años\n` +
    `• Ciudad: ${userData.ciudad}\n` +
    `• Ocupación: ${userData.ocupacion}\n` +
    `• Urgencia: ${urgenciaTexto}\n\n` +
    `📌 *SERVICIO DE INTERÉS*\n` +
    `${nombreServicio}\n\n` +
    `📝 *RESPUESTAS DEL EVALUADOR*\n` +
    `${respuestasTexto}\n\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `Hola, completé la evaluación en su sitio web. ¿Podrían darme orientación sobre los siguientes pasos? Gracias.`;

  btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  btn.target = '_blank';
}

// Handler del click en "Ver resultado" - el navegador maneja el href
function clicVerResultado(e) {
  console.log('🔄 Clic en Ver resultado');
  const qs = PREGUNTAS[userData.servicio] || [];
  const respondidas = Object.keys(userData.respuestas).length;

  if (respondidas < qs.length) {
    e.preventDefault();
    mostrarToast(`⚠️ Falta(n) ${qs.length - respondidas} pregunta(s) por responder`);
    const grupos = document.querySelectorAll('#dynamicQuestions .option-group');
    for (let i = 0; i < grupos.length; i++) {
      if (!userData.respuestas.hasOwnProperty(i)) {
        grupos[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        grupos[i].style.outline = '3px solid #EF4444';
        setTimeout(() => { grupos[i].style.outline = ''; }, 2500);
        break;
      }
    }
    return false;
  }

  // Asegurar que el href esté actualizado
  actualizarHrefVerResultado();

  // Guardar lead localmente
  const lead = {
    fecha: new Date().toISOString(),
    ...userData,
    nombreServicio: (SERVICIOS[userData.servicio] && SERVICIOS[userData.servicio].nombre) || userData.servicio
  };
  try {
    const leads = JSON.parse(localStorage.getItem('tramitego_leads') || '[]');
    leads.push(lead);
    localStorage.setItem('tramitego_leads', JSON.stringify(leads));
    console.log('🟢 Lead guardado:', lead);
  } catch(e) {}

  // Sincronizar con backend (asíncrono, no bloquea)
  if (typeof sincronizarLead === 'function') {
    sincronizarLead(lead).catch(err => console.warn('Sync:', err));
  }

  // Mostrar paso 4 después de un breve delay (para que el navegador abra WhatsApp primero)
  setTimeout(() => {
    const wppHref = document.getElementById('btnVerResultado').href;
    const resultBtn = document.getElementById('whatsappResult');
    if (resultBtn) resultBtn.href = wppHref;

    const resultMsg = document.getElementById('resultMessage');
    if (resultMsg) {
      resultMsg.innerHTML = `<strong>${userData.nombre}</strong>, ¡recibimos tu evaluación! Te conectamos con un asesor por WhatsApp.<br><br>Si no se abrió WhatsApp, presiona el botón verde de abajo.`;
    }
    goToStep(4);
  }, 100);

  // IMPORTANTE: retornar true para que el navegador siga el href
  console.log('✅ Abriendo WhatsApp:', document.getElementById('btnVerResultado').href.substring(0, 80));
  return true;
}

function evaluate() {
  console.log('🔄 Evaluate iniciado', userData);
  try {
    const qs = PREGUNTAS[userData.servicio] || [];
    const respondidas = Object.keys(userData.respuestas).length;
    console.log(`Respuestas: ${respondidas} / ${qs.length}`);

    // Validar que todas las preguntas estén respondidas
    if (respondidas < qs.length) {
      mostrarToast(`⚠️ Falta(n) ${qs.length - respondidas} pregunta(s) por responder`);
      const grupos = document.querySelectorAll('#dynamicQuestions .option-group');
      for (let i = 0; i < grupos.length; i++) {
        if (!userData.respuestas.hasOwnProperty(i)) {
          grupos[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
          grupos[i].style.outline = '3px solid #EF4444';
          setTimeout(() => { grupos[i].style.outline = ''; }, 2500);
          break;
        }
      }
      return;
    }

    const nombreServicio = (SERVICIOS[userData.servicio] && SERVICIOS[userData.servicio].nombre) || userData.servicio || 'Trámite no especificado';

    // Mapeo amigable de urgencia
    const urgenciaTexto = {
      urgente: '🔴 URGENTE (próximas 2 semanas)',
      pronto: '🟠 Pronto (este mes)',
      planeando: '🟡 Planeando (1-3 meses)',
      explorando: '🟢 Solo explorando opciones'
    }[userData.urgencia] || userData.urgencia || 'No especificada';

    // Construir mensaje completo y profesional para el asesor
    const respuestasTexto = qs.map((q, i) => `   • ${q.p}\n     → *${userData.respuestas[i] || 'Sin respuesta'}*`).join('\n');

    const mensaje =
      `🎯 *NUEVO LEAD - Trámite GO*\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 *DATOS DEL CLIENTE*\n` +
      `• Nombre: ${userData.nombre}\n` +
      `• WhatsApp: ${userData.whatsapp}\n` +
      `• Correo: ${userData.correo}\n` +
      `• Edad: ${userData.edad} años\n` +
      `• Ciudad: ${userData.ciudad}\n` +
      `• Ocupación: ${userData.ocupacion}\n` +
      `• Urgencia: ${urgenciaTexto}\n\n` +
      `📌 *SERVICIO DE INTERÉS*\n` +
      `${nombreServicio}\n\n` +
      `📝 *RESPUESTAS DEL EVALUADOR*\n` +
      `${respuestasTexto}\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `Hola, completé la evaluación en su sitio web. ¿Podrían darme orientación sobre los siguientes pasos? Gracias.`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeCodificado}`;

    // Guardar el lead localmente
    const leadCompleto = {
      fecha: new Date().toISOString(),
      ...userData,
      nombreServicio: nombreServicio,
      urgenciaTexto: urgenciaTexto
    };
    try {
      const leads = JSON.parse(localStorage.getItem('tramitego_leads') || '[]');
      leads.push(leadCompleto);
      localStorage.setItem('tramitego_leads', JSON.stringify(leads));
      console.log('🟢 Lead guardado localmente:', leadCompleto);
    } catch (e) { console.warn('No se pudo guardar lead local:', e); }

    // SINCRONIZACIÓN CON BACKEND
    // Aquí enviamos los datos al sistema interno o webhook
    sincronizarLead(leadCompleto).catch(err => console.warn('Sync falló:', err));

    // Asignar URL al botón del paso 4
    const whatsappResultBtn = document.getElementById('whatsappResult');
    if (whatsappResultBtn) {
      whatsappResultBtn.href = urlWhatsApp;
    }

    // Actualizar mensaje de resultado
    const resultMsg = document.getElementById('resultMessage');
    if (resultMsg) {
      resultMsg.innerHTML =
        `<strong>${userData.nombre}</strong>, ¡hemos recibido tu evaluación! ` +
        `Estamos abriendo WhatsApp para conectarte con un asesor que revisará tu caso de ` +
        `<strong>${nombreServicio}</strong> y te dará una respuesta personalizada.<br><br>` +
        `Si WhatsApp no se abrió automáticamente, presiona el botón de abajo.`;
    }

    // Abrir WhatsApp INMEDIATAMENTE (sin setTimeout para evitar popup blocker)
    const ventana = window.open(urlWhatsApp, '_blank');

    // Ir al paso 4
    goToStep(4);

    // Si el navegador bloqueó el popup, ofrecer click manual destacado
    if (!ventana || ventana.closed === undefined ? false : ventana.closed) {
      mostrarToast('👉 Haz clic en el botón verde para abrir WhatsApp');
    } else {
      mostrarToast('✅ ¡Mensaje listo en WhatsApp!');
    }

  } catch (err) {
    console.error('❌ Error en evaluate():', err);
    mostrarToast('⚠️ Error: ' + (err.message || 'Intenta de nuevo'));
  }
}

// Sincronización con backend (webhook / sistema interno)
async function sincronizarLead(lead) {
  // OPCIÓN A ACTIVADA: Sincronizar con sistema interno tramite-go.vercel.app
  // Intenta varios endpoints comunes del sistema
  const endpoints = [
    'https://tramite-go.vercel.app/api/leads',
    'https://tramite-go.vercel.app/api/captura',
    'https://tramite-go.vercel.app/api/lead'
  ];

  for (const url of endpoints) {
    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(lead)
      });
      if (respuesta.ok) {
        console.log('✓ Lead sincronizado con sistema interno via', url);
        return;
      }
    } catch (e) {
      console.warn('Endpoint ' + url + ' no respondió, probando siguiente...');
    }
  }
  console.warn('⚠️ Ningún endpoint respondió. Revisa que el sistema interno tenga API o configura el endpoint correcto en script.js línea ~280');

  // OPCIÓN B: Formspree (más fácil de configurar, gratis hasta 50/mes)
  // Crea cuenta en formspree.io, copia tu endpoint y descomenta:
  /*
  try {
    await fetch('https://formspree.io/f/TU_CODIGO_AQUI', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(lead)
    });
    console.log('✓ Lead enviado por correo via Formspree');
  } catch (e) {
    console.warn('Formspree falló:', e);
  }
  */

  // Mientras tanto, registramos en consola para que veas que llegó
  console.log('📦 Lead listo para sincronizar:', lead);
  return Promise.resolve();
}

function resetEvaluator() {
  userData = { nombre: '', whatsapp: '', correo: '', edad: '', ciudad: '', ocupacion: '', urgencia: '', servicio: '', respuestas: {} };
  ['nombre', 'whatsapp', 'correo', 'edad', 'ciudad', 'ocupacion'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const urg = document.getElementById('urgencia');
  if (urg) urg.value = '';
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('dynamicQuestions').innerHTML = '';
  goToStep(1);
}

// ========== ANIMACIONES SCROLL ==========
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.service-card, .testimonial-card, .blog-card, .contact-card, .step-card, .trust-bar-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Cerrar modales al hacer click fuera
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Exponer funciones al scope global (para onclick inline)
window.iniciarEvaluacion = iniciarEvaluacion;
window.cotizarServicio = cotizarServicio;
window.agregarAlCarrito = agregarAlCarrito;
window.quitarDelCarrito = quitarDelCarrito;
window.cambiarCantidad = cambiarCantidad;
window.abrirCarrito = abrirCarrito;
window.cerrarCarrito = cerrarCarrito;
window.abrirCheckout = abrirCheckout;
window.cerrarCheckout = cerrarCheckout;
window.procesarPago = procesarPago;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.evaluate = evaluate;
window.resetEvaluator = resetEvaluator;
window.seleccionarRespuesta = seleccionarRespuesta;
window.clicVerResultado = clicVerResultado;
window.actualizarHrefVerResultado = actualizarHrefVerResultado;
