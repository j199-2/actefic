// --- VIEW SWITCHER (LOCAL / GLOBAL) ---
function showGlobalView() {
  document.getElementById('view-local').classList.add('hidden');
  document.getElementById('view-global').classList.remove('hidden');
  document.getElementById('sobre-mi-local').classList.add('hidden');
  document.getElementById('sobre-mi-global').classList.remove('hidden');
  window.scrollTo(0, 0);
}
function showLocalView() {
  document.getElementById('view-global').classList.add('hidden');
  document.getElementById('view-local').classList.remove('hidden');
  document.getElementById('sobre-mi-global').classList.add('hidden');
  document.getElementById('sobre-mi-local').classList.remove('hidden');
  window.scrollTo(0, 0);
}
function scrollToSobreMi() {
  const local = document.getElementById('sobre-mi-local');
  const global = document.getElementById('sobre-mi-global');
  if (!local.classList.contains('hidden')) local.scrollIntoView({behavior: 'smooth'});
  else global.scrollIntoView({behavior: 'smooth'});
}

function toggleMenu() { document.getElementById('menu-movil').classList.toggle('hidden'); }

// --- EXPERIENCE MODAL (LOCAL & GLOBAL) ---
function openExperience() {
  const isGlobal = !document.getElementById('view-global').classList.contains('hidden');
  if(isGlobal) {
    document.getElementById('experience-modal-global').classList.remove('hidden');
    document.getElementById('experience-content-global').scrollTop = 0;
    document.getElementById('exp-close-btn-global').classList.add('opacity-0','pointer-events-none');
  } else {
    document.getElementById('experience-modal-local').classList.remove('hidden');
    document.getElementById('experience-content-local').scrollTop = 0;
    document.getElementById('exp-close-btn-local').classList.add('opacity-0','pointer-events-none');
  }
  document.body.style.overflow = 'hidden';
}
function closeExperience() {
  document.getElementById('experience-modal-local').classList.add('hidden');
  document.getElementById('experience-modal-global').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// --- SOURCING CAROUSEL ---
let currentSlide = 0;
function openSourcingCarousel() { document.getElementById('sourcing-modal').classList.remove('hidden'); document.body.style.overflow = 'hidden'; showSlide(0); }
function closeSourcingCarousel() { document.getElementById('sourcing-modal').classList.add('hidden'); document.body.style.overflow = 'auto'; }
function showSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  slides.forEach(s => s.classList.remove('active')); dots.forEach(d => d.classList.remove('bg-accent-500')); dots.forEach(d => d.classList.add('bg-background-300'));
  if(index >= slides.length) index = 0; if(index < 0) index = slides.length - 1;
  slides[index].classList.add('active'); dots[index].classList.remove('bg-background-300'); dots[index].classList.add('bg-accent-500'); currentSlide = index;
}
function nextSlide() { showSlide(currentSlide + 1); } function prevSlide() { showSlide(currentSlide - 1); }

// --- MAIN LOGIC ON LOAD ---
document.addEventListener('DOMContentLoaded', function() {
  // Scroll Progress & Reveal for BOTH Local & Global Experience
  function setupExperienceScroll(contentDiv, progressBarId, closeBtnId) {
    if(contentDiv) {
      contentDiv.addEventListener('scroll', function() {
        let progress = (contentDiv.scrollTop / (contentDiv.scrollHeight - contentDiv.clientHeight)) * 100;
        document.getElementById(progressBarId).style.width = progress + '%';
        if (progress > 85) document.getElementById(closeBtnId).classList.remove('opacity-0','pointer-events-none');
        else document.getElementById(closeBtnId).classList.add('opacity-0','pointer-events-none');
      });
      const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }); }, { root: contentDiv, threshold: 0.3 });
      contentDiv.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
  }
  setupExperienceScroll(document.getElementById('experience-content-local'), 'exp-progress-bar-local', 'exp-close-btn-local');
  setupExperienceScroll(document.getElementById('experience-content-global'), 'exp-progress-bar-global', 'exp-close-btn-global');
  
  // Hero Sector Selector
  for (const key in sectorsData) { const option = document.createElement('option'); option.value = key; option.innerText = sectorsData[key].name; document.getElementById('hero-sector-selector').appendChild(option); }

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); const btn = contactForm.querySelector('button[type="submit"]'); const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Enviando...'; btn.disabled = true;
      fetch(contactForm.action, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(contactForm)).toString() })
      .then(() => { contactForm.reset(); btn.innerHTML = '<i class="ri-check-line"></i> ¡Mensaje Enviado!'; setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 4000); })
      .catch(error => { btn.innerHTML = '<i class="ri-error-warning-line"></i> Error. Intente de nuevo.'; setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 4000); });
    });
  }

  // Geo-location Auto-switch
  fetch('https://ipapi.co/json/').then(r => r.json()).then(data => {
    if (data.country_code && data.country_code !== 'DO') {
      showGlobalView();
      const banner = document.createElement('div'); banner.id = 'geo-banner';
      banner.className = 'fixed top-24 left-1/2 -translate-x-1/2 z-[90] max-w-md px-5 py-3 rounded-xl bg-primary-800 text-background-50 shadow-lg text-sm font-medium flex items-center gap-3 notranslate'; banner.setAttribute('translate', 'no');
      banner.innerHTML = '<i class="ri-global-line text-lg text-accent-400"></i><span>We detected you\'re outside the Dominican Republic — showing Global Services.</span><button onclick="showLocalView(); document.getElementById(\'geo-banner\').remove();" class="ml-2 underline text-accent-400 hover:text-accent-300 whitespace-nowrap font-semibold">View Local RD</button><button onclick="document.getElementById(\'geo-banner\').remove();" class="ml-1 text-background-400 hover:text-background-200"><i class="ri-close-line"></i></button>';
      document.body.appendChild(banner);
      setTimeout(() => { if (document.getElementById('geo-banner')) { const b = document.getElementById('geo-banner'); b.style.transition = 'opacity 1s ease-out'; b.style.opacity = '0'; setTimeout(() => b.remove(), 1000); } }, 8000);
    }
  }).catch(() => { /* Failed */ });
});

// --- DATA ---
const servicesData = {
  sourcing: { title: "Sourcing & Conexión con Suplidores", icon: "ri-shake-hands-line", aiGreeting: "Conectamos compradores e inversionistas extranjeros con suplidores reales y fábricas en RD. Actuamos como tu brazo operativo: auditamos instalaciones, negociamos precios y garantizamos calidad en tabaco, agroindustria y manufactura. ¿Buscas suplidores en el país?" },
  emprendedores: { title: "Emprendedores e Ideas (Fase Cero)", icon: "ri-rocket-2-line", details: ["Validación Financiera: Cálculo de costos proyectados y precios antes de invertir un solo peso.", "Blindaje Legal: ONAPI, Estatutos (SRL/EIRL), RNC en DGII y perfil impositivo inteligente.", "Arquitectura del Negocio: Organigrama inicial, roles clave y procesos básicos documentados.", "Lanzamiento Digital Interactivo: Página web con IA para captar clientes 24/7 desde el día 1."], aiGreeting: "Tener una gran idea es solo el 10% del éxito; el otro 90% es la estructura. En AcTefic no te damos palmaditas en la espalda; nos sentamos contigo a formalizar tu negocio en ONAPI y DGII, calculamos tus costos reales para garantizar que vas a ganar dinero y te armamos la estrategia comercial y digital para lanzar con fuerza. No lances a ciegas ni arriesgues tus ahorros. ¿Tienes tu idea clara pero no sabes cómo estructurarla?" },
  rrhh: { title: "Gestión del Talento Humano", icon: "ri-team-line", details: ["Evaluación de productividad del equipo actual.", "Estructuración de nuevos roles y eliminación de duplicidades.", "Capacitación operativa alineada al crecimiento."], aiGreeting: "El problema no es el empleado, es la estructura. Si el negocio se cae a pedazos cuando tú no estás, no tienes una empresa, tienes un empleo disfrazado. ¿Sientes que el negocio se detiene si te vas de vacaciones?" },
  procesos: { title: "Estructuración de Procesos", icon: "ri-settings-3-line", details: ["Mapeo de procesos (compras, ventas, almacén).", "Manuales operativos claros y documentados.", "Protocolos de servicio al cliente estandarizados."], aiGreeting: "El caos del día a día quema tu tiempo y tus ganancias. Si no hay manuales claros, cada tarea se hace diferente. ¿Tus procesos actuales están documentados o están en la cabeza de la gente?" },
  finanzas: { title: "Sanación Financiera", icon: "ri-money-dollar-circle-line", details: ["Recuperación de cuentas por cobrar estancadas.", "Estrategias de cobranza firmes y profesionales.", "Gestión de pagos para evitar descapitalización."], aiGreeting: "Ese es el síntoma más grave: tener ventas pero no dinero en el banco. El dinero en la calle tranca el juego. Hacemos un Diagnóstico de 72 horas: si no encontramos cómo recuperar el doble de lo que cuesta, no nos pagas. ¿Cuánto tienes parado en la calle?" },
  costos: { title: "Costos y Distribución", icon: "ri-scales-3-line", details: ["Ingeniería de costos exacta (materia prima, mermas).", "Estrategia de precios escalonados (detalle/mayor).", "Logística para entrar a puntos de venta físicos."], aiGreeting: "Si fabricas y no conoces tu costo real centavo a centavo, estás perdiendo dinero en cada venta. Estructuramos tus costos y tu distribución. ¿Sabes exactamente cuánto ganas por unidad vendida?" },
  compras: { title: "Compras y Distribución B2B", icon: "ri-shopping-cart-2-line", details: ["Freno a la compra 'al menudeo': Análisis de consumo anual para comprar lotes directo de fábrica y reducir costos hasta un 50%.", "Creación de Canal Mayorista (B2B): Estructuración para vender excedentes de materia prima a pequeños competidores.", "Negociación Estratégica: Alianzas directas con importadores principales o fábricas de origen.", "Escalabilidad de Negocio: Transformación de simple fabricante a suplidor oficial de su zona."], aiGreeting: "Sé exactamente lo que le pasa a tu negocio: estás vendiendo mucho, pero sientes que no te queda dinero en las manos porque estás comprando mal. Si compras materia prima 'al menudeo' o en 'chines' todas las semanas, le estás regalando tu margen al intermediario.<br><br>En AcTefic implementamos una Ingeniería de Compras y Cadena de Suministro. Entramos a tu negocio, calculamos tu consumo real y te estructuramos para comprar al por mayor directo de importación. Pero no nos quedamos ahí: te organizamos para que uses lo que necesitas a mitad de precio y le vendas el excedente al por mayor a tu competencia, convirtiéndote en el suplidor de tu zona. Vamos a analyze tu volumen de compra: agendemos tu Diagnóstico 360° hoy mismo." },
  comercial: { title: "Estrategia Comercial y Legal", icon: "ri-line-chart-line", details: ["Planes prácticos de captación para nuevos mercados.", "Formalización legal de la empresa (SRL, EIRL).", "Registro de marca para blindar el negocio."], aiGreeting: "Ojo con esto: más clientes sin estructura interna solo significa más caos. No hacemos marketing estético. Integramos tecnología orientada a rentabilidad. ¿Tu proceso actual aguanta el doble de clientes sin colapsar?" },
  digital: { title: "Integración Digital (Plus)", icon: "ri-cpu-line", details: ["Desarrollo de plataformas B2B automatizadas.", "Catálogos interactivos y automatización con IA.", "Herramientas orientadas estrictamente a la rentabilidad 24/7."], aiGreeting: "No hacemos webs cosméticas para dar 'likes'. Implementamos herramientas tecnológicas que automatizan tus ventas 24/7. ¿Estás listo para que la tecnología trabaje por ti?" },
  legal: { title: "Formalización Legal y Corporativa", icon: "ri-government-line", details: ["Registro de Nombre Comercial en ONAPI (defensa de marca).", "Estatutos Sociales (SRL/EIRL) y Registro Mercantil en Cámara de Comercio.", "Inscripción en DGII: Obtención de RNC y habilitación de NCF (ITBIS, ISR).", "Alta como empleador en TSS y SIRLA (Ministerio de Trabajo)."], aiGreeting: "Si estás operando en la informalidad, estás limitando el crecimiento de tu negocio y corriendo un gran peligro. En AcTefic nos encargamos de todo: desde proteger tu nombre en ONAPI, redactar tus Estatutos, gestionar tu RNC en la DGII para que emitis comprobantes, hasta registrar a tu equipo en la TSS para evitarte líos laborales. Te entregamos tu empresa blindada y lista para hacer negocios en grande. ¿Tienes tu empresa formalizada o estás operando en la informalidad?" },
  financiero_ops: { title: "Optimización para Financieras", icon: "ri-bank-line", details: ["Freno y Control de la Mora: Reestructuración del sistema de cobros para rescatar cartera vencida sin perder al cliente.", "Capacitación de Oficiales de Crédito: Entrenamiento en el terreno para medir riesgo real de la zona y colocar capital seguro.", "Estrategias de Colocación Segura: Creación de canales nuevos y controlados para expandir préstamos con garantía."], aiGreeting: "El dinero atrapado en la calle es el cáncer de las financieras. Si tus oficiales de crédito colocan capital a lo loco por cumplir metas sin medir el riesgo real de la zona, tu morosidad te va a quebrar.<br><br>En AcTefic entramos a frenar la mora reestructurando tu sistema de cobros de inmediato para rescatar esa cartera vencida. Además, entrenamos a tu personal en el terreno para que filtren bien y coloquen capital de forma segura. Rescata tu dinero hoy. ¿Agendamos tu Diagnóstico 360°?" },
  mueblerias_credit: { title: "Liquidez para Mueblerías y Dealers", icon: "ri-store-2-line", details: ["Protección de Flujo de Caja: Detenemos la sangría de 'fiar a pulmón' y blindamos tu efectivo operativo.", "Crédito y Cobro Profesional: Sistema formal de evaluación y cobros para dejar de apuntar en mascotas.", "Apalancamiento con Inventario: Estructuración para mover mercancía de alto valor sin descapitalizarte."], aiGreeting: "Si estás financiando a tus clientes de tu propio bolsillo y 'fiando a pulmón', te estás quedando sin liquidez para operar. Un inventario parado y una cartera de cobros informal apuntada en mascotas es una bomba de tiempo.<br><br>En AcTefic blindamos tu flujo de caja deteniendo esa sangría, te montamos un sistema profesional de evaluación y cobro, y estructuramos tu inventario para que muevas mercancía de alto valor sin descapitalizarte. Detén la sangría de dinero. Agenda tu Diagnóstico 360° ahora." }
};

const sectorsData = {
  cero_idea: { name: "1. Tengo una idea / proyecto en mente", types: ["emprendedores", "legal", "finanzas"] },
  panaderia: { name: "2. Panaderías y Reposterías", types: ["costos", "procesos", "compras"] },
  restaurantes: { name: "3. Restaurantes, Cafeterías y Pizzerías", types: ["procesos", "finanzas", "compras"] },
  muebles: { name: "4. Fábricas de Muebles y Ebanisterías", types: ["costos", "procesos", "compras"] },
  bloques: { name: "5. Fábricas de Bloques y Materiales", types: ["procesos", "finanzas", "compras"] },
  agro: { name: "6. Fincas, Granjas y Agronegocios", types: ["comercial", "costos", "legal"] },
  confeccion: { name: "7. Confección de Ropa y Textiles", types: ["procesos", "costos", "compras"] },
  imprentas: { name: "8. Imprentas y Litografías", types: ["costos", "finanzas", "compras"] },
  hielo: { name: "9. Fábricas de Hielo y Agua Purificada", types: ["costos", "procesos", "compras"] },
  ferreterias: { name: "10. Ferreterías", types: ["procesos", "finanzas", "compras"] },
  supermercados: { name: "11. Supermercados y Minimarkets", types: ["finanzas", "procesos", "compras"] },
  repuestos: { name: "12. Tiendas de Repuestos de Vehículos", types: ["procesos", "finanzas", "digital"] },
  boutiques: { name: "13. Tiendas de Ropa y Boutiques", types: ["finanzas", "comercial", "rrhh"] },
  electrodomesticicos: { name: "14. Electrodomésticos y Mueblerías", types: ["mueblerias_credit", "finanzas", "legal"] },
  distribuidoras: { name: "15. Distribuidoras de Consumo Masivo", types: ["finanzas", "procesos", "compras"] },
  farmacias: { name: "16. Farmacias", types: ["procesos", "finanzas", "compras"] },
  joyerias: { name: "17. Joyerías y Accesorios de Lujo", types: ["procesos", "legal", "finanzas"] },
  hogar_decoracion: { name: "18. Tiendas de Hogar y Decoración", types: ["procesos", "finanzas", "compras"] },
  talleres: { name: "19. Talleres Mecánicos y Desabolladura", types: ["finanzas", "procesos", "compras"] },
  salons_belleza: { name: "20. Salones de Belleza, Spas y Barberías", types: ["rrhh", "procesos", "finanzas"] },
  clinicas_esteticas: { name: "21. Clínicas Estéticas y Dermatología", types: ["procesos", "digital", "finanzas"] },
  couriers: { name: "22. Agencias de Envío (Couriers) y Mudanzas", types: ["procesos", "digital", "rrhh"] },
  lavanderias: { name: "23. Lavanderías y Centros de Tintorería", types: ["procesos", "legal", "rrhh"] },
  rentacar: { name: "24. Agencias de Alquiler de Vehículos (Rent-a-Car)", types: ["legal", "procesos", "finanzas"] },
  carwash: { name: "25. Car Wash y Centros de Detallado Vehicular", types: ["rrhh", "procesos", "compras"] },
  floristerias: { name: "26. Floristerías y Event Planners", types: ["procesos", "finanzas", "rrhh"] },
  limpieza: { name: "27. Empresas de Limpieza Residencial y Comercial", types: ["rrhh", "legal", "compras"] },
  consultorios: { name: "28. Consultorios Médicos y Odontológicos", types: ["rrhh", "digital", "finanzas"] },
  abogados: { name: "29. Firmas de Abogados", types: ["finanzas", "procesos", "legal"] },
  contabilidad: { name: "30. Oficinas de Contabilidad y Asesoría Fiscal", types: ["procesos", "finanzas", "legal"] },
  inmobiliarias: { name: "31. Agencias Inmobiliarias (Bienes Raíces)", types: ["rrhh", "legal", "comercial"] },
  financieras: { name: "32. Financieras y Empresas de Préstamos", types: ["financiero_ops", "legal", "procesos"] },
  laboratorios: { name: "33. Laboratorios Clínicos y Centros de Diagnóstico", types: ["procesos", "digital", "compras"] },
  seguros: { name: "34. Agencias de Seguros (Corredores)", types: ["comercial", "digital", "finanzas"] },
  veterinarias: { name: "35. Centros Veterinarios y Pet Shops", types: ["procesos", "finanzas", "compras"] },
  colegios: { name: "36. Colegios Privados y Salas de Tarea", types: ["finanzas", "rrhh", "procesos"] },
  constructoras: { name: "37. Constructoras y Empresas de Ingeniería", types: ["legal", "costos", "compras"] },
  agencias_marketing: { name: "38. Agencias de Marketing y Desarrollo de Software", types: ["legal", "procesos", "finanzas"] },
  daycare: { name: "39. Centros de Cuidado Infantil (Daycare) y Campamentos", types: ["procesos", "legal", "rrhh"] },
  gimnasios: { name: "40. Gimnasios y Centros de Fitness", types: ["finanzas", "rrhh", "comercial"] },
  seguridad: { name: "41. Empresas de Seguridad Privada y Vigilancia", types: ["rrhh", "legal", "procesos"] },
  tabacalera: { name: "42. Industria Tabacalera y Cigarros", types: ["sourcing", "procesos", "legal"] }
};

const waLink = "https://api.whatsapp.com/send?phone=18094328712&text=mas%20informaci%C3%B3n%20(ACTEFIC)%20";
const waLinkGlobal = "https://api.whatsapp.com/send?phone=18094328712&text=Hello%20AcTefic%2C%20I%20am%20interested%20in%20your%20Global%20Services%20%28Sourcing%2C%20Auditing%20or%20Remote%20Consulting%29.";
let activeSectorKey = null;

// --- SERVICE MODAL ---
function openServiceModal(serviceKey) {
  const service = servicesData[serviceKey];
  document.getElementById('modal-title').innerText = service.title; document.getElementById('modal-icon').className = service.icon + " text-3xl";
  const ul = document.getElementById('modal-details-list'); ul.innerHTML = '';
  if(service.details) { service.details.forEach(detail => { const li = document.createElement('li'); li.className = "flex items-start gap-3"; li.innerHTML = `<div class="w-5 h-5 flex items-center justify-center rounded-full mt-0.5 flex-shrink-0 bg-primary-500"><i class="ri-check-line text-background-50 text-xs"></i></div><span class="text-sm text-foreground-700">${detail}</span>`; ul.appendChild(li); }); }
  document.getElementById('modal-chat-body').innerHTML = ''; document.getElementById('modal-chat-options').innerHTML = '';
  document.getElementById('service-modal').classList.remove('hidden'); document.body.style.overflow = 'hidden'; 
  setTimeout(() => { addModalBotMessage(service.aiGreeting); setModalOptions([{ text: "Sí, necesito estructurarla", next: () => modalClosingStep1() }, { text: "No sé por dónde empezar", next: () => modalClosingStep1() }]); }, 500);
}
function closeServiceModal() { document.getElementById('service-modal').classList.add('hidden'); document.body.style.overflow = 'auto'; }

function addModalBotMessage(text, showWaButton = false) {
  const div = document.createElement('div'); div.className = 'flex items-start gap-2 max-w-[90%]';
  let buttonHtml = showWaButton ? `<a href="${waLink}" target="_blank" class="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition-colors w-full justify-center"><i class="ri-whatsapp-line"></i> Hablar con el Consultor</a>` : '';
  div.innerHTML = `<div class="w-8 h-8 flex-shrink-0 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center"><i class="ri-robot-2-line"></i></div><div class="bg-background-100 p-3 rounded-lg rounded-tl-none text-sm text-foreground-700 shadow-sm">${text} ${buttonHtml}</div>`;
  document.getElementById('modal-chat-body').appendChild(div); document.getElementById('modal-chat-body').scrollTop = document.getElementById('modal-chat-body').scrollHeight;
}
function addModalUserMessage(text) {
  const div = document.createElement('div'); div.className = 'flex items-start gap-2 max-w-[90%] justify-end'; div.innerHTML = `<div class="bg-primary-500 text-background-50 p-3 rounded-lg rounded-tr-none text-sm shadow-sm">${text}</div>`;
  document.getElementById('modal-chat-body').appendChild(div); document.getElementById('modal-chat-body').scrollTop = document.getElementById('modal-chat-body').scrollHeight;
}
function setModalOptions(options) {
  const container = document.getElementById('modal-chat-options'); container.innerHTML = '';
  options.forEach(opt => { const btn = document.createElement('button'); btn.className = 'px-3 py-1.5 bg-background-100 hover:bg-primary-100 text-primary-700 text-xs font-medium rounded-full border border-background-200 transition-colors w-full text-center'; btn.innerText = opt.text; btn.onclick = () => { addModalUserMessage(opt.text); container.innerHTML = ''; if(opt.next) opt.next(); }; container.appendChild(btn); });
}
function modalClosingStep1() { addModalBotMessage("Para darte una respuesta exacta sobre cómo resolver eso en tu sector, ¿de qué es tu negocio y cuántos empleados o departamentos manejas?"); document.getElementById('modal-chat-input').focus(); }
function handleModalUserInput(event) { if (event.key === 'Enter') { const input = document.getElementById('modal-chat-input'); const text = input.value.trim(); if (text === '') return; addModalUserMessage(text); input.value = ''; } }

// --- CHATBOT ---
function toggleChat() {
  const chatWidget = document.getElementById('ai-chat-widget'); const chatToggleBtn = document.getElementById('ai-chat-button');
  chatWidget.classList.toggle('hidden');
  if (!chatWidget.classList.contains('hidden')) { chatToggleBtn.classList.add('hidden'); if (document.getElementById('chat-body').innerHTML === '') { if(activeSectorKey) startPersonalizedConsultation(activeSectorKey); else startGlobalConsultation(); } } else { chatToggleBtn.classList.remove('hidden'); }
}
function addBotMessage(text, showWaButton = false) {
  const div = document.createElement('div'); div.className = 'flex items-start gap-2 max-w-[90%]';
  let buttonHtml = showWaButton ? `<a href="${waLink}" target="_blank" class="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition-colors w-full justify-center"><i class="ri-whatsapp-line"></i> Hablar con el Consultor por WhatsApp</a>` : '';
  div.innerHTML = `<div class="w-8 h-8 flex-shrink-0 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center"><i class="ri-robot-2-line"></i></div><div class="bg-background-100 p-3 rounded-lg rounded-tl-none text-sm text-foreground-700 shadow-sm">${text} ${buttonHtml}</div>`;
  document.getElementById('chat-body').appendChild(div); document.getElementById('chat-body').scrollTop = document.getElementById('chat-body').scrollHeight;
}
function addUserMessage(text) {
  const div = document.createElement('div'); div.className = 'flex items-start gap-2 max-w-[90%] justify-end'; div.innerHTML = `<div class="bg-primary-500 text-background-50 p-3 rounded-lg rounded-tr-none text-sm shadow-sm">${text}</div>`;
  document.getElementById('chat-body').appendChild(div); document.getElementById('chat-body').scrollTop = document.getElementById('chat-body').scrollHeight;
}
function setOptions(options) {
  const container = document.getElementById('chat-options'); container.innerHTML = '';
  options.forEach(opt => { const btn = document.createElement('button'); btn.className = 'px-3 py-1.5 bg-background-100 hover:bg-primary-100 text-primary-700 text-xs font-medium rounded-full border border-background-200 transition-colors w-full text-center'; btn.innerText = opt.text; btn.onclick = () => { addUserMessage(opt.text); container.innerHTML = ''; if(opt.next) opt.next(); }; container.appendChild(btn); });
}
function getAreaNames(typesArray) { return typesArray.map(t => servicesData[t].title.split(" ")[0]).join(" y "); }

function startGlobalConsultation() {
  let isGlobal = !document.getElementById('view-global').classList.contains('hidden');
  if(isGlobal) {
    addBotMessage("Hello! I am the <span class='notranslate'>AcTefic</span> AI Consultant. Are you looking for a remote operations consultant, or do you need a boots-on-the-ground audit/sourcing partner in the Dominican Republic?");
    setOptions([ { text: "Remote Operations Consulting", next: () => talkRemoteConsulting() }, { text: "Sourcing & On-Site Auditing in RD", next: () => talkSourcing() } ]);
  } else {
    addBotMessage("Hola. Soy el Consultor IA de <span class='notranslate'>AcTefic</span>. No estoy aquí para darte teoría, estoy aquí para guiarte hacia la solución exacta para tu negocio. Selecciona tu sector en el menú desplegable de abajo y resaltaré en la web las áreas que necesitas optimizar:"); renderSectorSelector();
  }
}
function talkRemoteConsulting() { addBotMessage("Perfect. As a Freelance Operations Consultant, I help international entrepreneurs and companies structure their remote teams, optimize cash flow, and document processes without needing to be physically present. We work via Zoom, Notion, and KPI tracking.<br><br>To analyze your remote operation, please share your name, company email, and the main bottleneck you are facing.", true); setOptions([{ text: "Speak with a Consultant", next: () => window.open(waLinkGlobal, '_blank') }]); }
function startPersonalizedConsultation(key) {
  const sector = sectorsData[key]; const areas = getAreaNames(sector.types);
  addBotMessage(`Hola. Vi que seleccionaste el sector <strong>${sector.name.replace(/^\d+\.\s*/, '')}</strong>. Normalmente, en tu industria las áreas de <strong>${areas}</strong> suelen ser las más críticas.`);
  setTimeout(() => { addBotMessage(`He resaltado esos servicios más abajo en la web para que veas exactamente cómo los resolvemos. <br><br>¿Quieres que exploremos alguna de estas áreas, o prefieres ir directo a agendar un diagnóstico?`); setOptions([ { text: "Agendar Diagnóstico 360°", next: () => window.open(waLink, '_blank') }, { text: `Explorar ${servicesData[sector.types[0]].title}`, next: () => openServiceModal(sector.types[0]) } ]); }, 1000);
}
function renderSectorSelector() {
  const container = document.getElementById('chat-options'); container.innerHTML = '';
  const select = document.createElement('select'); select.className = 'w-full px-3 py-2.5 rounded-md border border-background-300 bg-background-50 text-sm text-foreground-700'; select.innerHTML = '<option value="">-- Selecciona tu sector --</option>';
  for (const key in sectorsData) { const option = document.createElement('option'); option.value = key; option.innerText = sectorsData[key].name; select.appendChild(option); }
  select.onchange = () => { if(select.value) { activeSectorKey = select.value; addUserMessage(sectorsData[select.value].name); container.innerHTML = '<p class="text-xs text-foreground-400 w-full text-center">Analizando tu sector...</p>'; highlightServices(sectorsData[select.value].types); setTimeout(() => { container.innerHTML = ''; handleSectorSelection(select.value); }, 800); } };
  container.appendChild(select);
  const btnSourcing = document.createElement('button'); btnSourcing.className = 'mt-2 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-medium rounded-full border border-primary-200 transition-colors w-full text-center'; btnSourcing.innerText = "Soy extranjero / Multinacional y opero en RD"; btnSourcing.onclick = () => { addUserMessage("Soy extranjero / Multinacional y opero en RD"); container.innerHTML = ''; talkSourcing(); }; container.appendChild(btnSourcing);
  const btnWhy = document.createElement('button'); btnWhy.className = 'mt-2 px-3 py-1.5 bg-accent-50 hover:bg-accent-100 text-accent-700 text-xs font-medium rounded-full border border-accent-200 transition-colors w-full text-center'; btnWhy.innerText = "¿Por qué elegir a AcTefic y no a otro?"; btnWhy.onclick = () => { addUserMessage("¿Por qué elegir a AcTefic y no a otro?"); container.innerHTML = ''; talkWhyAcTefic(); }; container.appendChild(btnWhy);
}
function talkSourcing() { addBotMessage("If you have executives abroad and operations in RD, we are your eyes on the ground. We connect international buyers with real suppliers of tobacco, cigars, agro-industry, and manufacturing.<br><br>Save thousands of dollars in travel and avoid supply chain surprises. We audit plants, control quality, and negotiate local prices.<br><br>To analyze your supplier connection or audit project, please share your name, corporate email, and the sector. A consultant will contact you shortly.", true); setOptions([{ text: "Speak with a Consultant", next: () => window.open(waLinkGlobal, '_blank') }]); }
function talkWhyAcTefic() { addBotMessage("La diferencia es muy simple: los demás te aconsejan o te programan; en <span class='notranslate'>AcTefic</span>, nosotros ejecutamos.<br><br>Si contr
