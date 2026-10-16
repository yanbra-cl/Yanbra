// ================================
// SPLASH SCREEN
// ================================
window.addEventListener('load', () => {
    const splash = document.getElementById('splash');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('oculto');
        }, 1500);
    }
});

// ================================
// MENÚ HAMBURGUESA
// ================================
function abrirMenu() {
    const menu = document.getElementById('menuLateral');
    const overlay = document.getElementById('menuOverlay');
    if (menu && overlay) {
        menu.classList.add('abierto');
        overlay.classList.add('abierto');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarMenu() {
    const menu = document.getElementById('menuLateral');
    const overlay = document.getElementById('menuOverlay');
    if (menu && overlay) {
        menu.classList.remove('abierto');
        overlay.classList.remove('abierto');
        document.body.style.overflow = '';
    }
}

// ================================
// ANIMACIONES AL BAJAR (IntersectionObserver)
// ================================
const elementosAnimar = document.querySelectorAll('.animar');

if (elementosAnimar.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    elementosAnimar.forEach(el => observer.observe(el));
}

// ================================
// FUNCIÓN GENERAL DE CARRUSEL
// ================================
function inicializarCarrusel(idCarrusel, idPuntitos) {
    const carrusel = document.getElementById(idCarrusel);
    if (!carrusel) return;
    
    const productos = carrusel.querySelectorAll('.producto');
    const puntitos = document.getElementById(idPuntitos);
    if (!puntitos) return;
    
    productos.forEach((producto, i) => {
        const puntito = document.createElement('div');
        puntito.className = 'carrusel-puntito' + (i === 0 ? ' activo' : '');
        puntito.onclick = () => {
            const anchoProducto = carrusel.firstElementChild.offsetWidth;
            const gap = 20;
            carrusel.scrollTo({ left: i * (anchoProducto + gap), behavior: 'smooth' });
        };
        puntitos.appendChild(puntito);
    });
    
    carrusel.addEventListener('scroll', () => {
        const anchoProducto = carrusel.firstElementChild.offsetWidth;
        const gap = 20;
        const indice = Math.round(carrusel.scrollLeft / (anchoProducto + gap));
        
        const todosPuntitos = puntitos.querySelectorAll('.carrusel-puntito');
        todosPuntitos.forEach((p, i) => {
            p.classList.toggle('activo', i === indice);
        });
    });
}

// Inicializar todos los carruseles (solo los que existan)
inicializarCarrusel('carrusel-ultimo', 'carrusel-puntitos-ultimo');
inicializarCarrusel('carrusel-superiores', 'carrusel-puntitos-superiores');
inicializarCarrusel('carrusel-inferiores', 'carrusel-puntitos-inferiores');
inicializarCarrusel('carrusel-accesorios', 'carrusel-puntitos-accesorios');

// ================================
// CAMBIAR FOTO DE GALERÍA
// ================================
function cambiarFoto(idPrincipal, miniatura) {
    const imgPrincipal = document.getElementById(idPrincipal);
    if (!imgPrincipal) return;
    
    imgPrincipal.src = miniatura.src;
    const miniaturas = miniatura.parentElement.querySelectorAll('img');
    miniaturas.forEach(img => img.classList.remove('activa'));
    miniatura.classList.add('activa');
}

// ================================
// LIGHTBOX CON SWIPE Y TECLADO
// ================================
let fotosActuales = [];
let indiceActual = 0;
let tituloActual = '';

function abrirLightbox(img, titulo) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    tituloActual = titulo || '';
    
    const galeria = img.closest('.galeria');
    
    if (galeria) {
        const miniaturas = galeria.querySelectorAll('.galeria-miniaturas img');
        fotosActuales = Array.from(miniaturas).map(m => m.src);
        indiceActual = fotosActuales.indexOf(img.src);
        if (indiceActual === -1) indiceActual = 0;
    } else {
        fotosActuales = [img.src];
        indiceActual = 0;
    }
    
    actualizarLightbox();
    lightbox.classList.add('abierto');
    document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('abierto');
    document.body.style.overflow = '';
}

function cambiarFotoLightbox(direccion) {
    indiceActual += direccion;
    if (indiceActual < 0) indiceActual = fotosActuales.length - 1;
    if (indiceActual >= fotosActuales.length) indiceActual = 0;
    actualizarLightbox();
}

function irAFoto(indice) {
    indiceActual = indice;
    actualizarLightbox();
}

function actualizarLightbox() {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitulo = document.getElementById('lightbox-titulo');
    const lightboxContador = document.getElementById('lightbox-contador');
    const puntitosContainer = document.getElementById('lightbox-puntitos');
    
    if (!lightboxImg) return;
    
    lightboxImg.src = fotosActuales[indiceActual];
    lightboxTitulo.textContent = tituloActual;
    lightboxContador.textContent = (indiceActual + 1) + ' / ' + fotosActuales.length;
    
    puntitosContainer.innerHTML = '';
    
    fotosActuales.forEach((foto, i) => {
        const puntito = document.createElement('div');
        puntito.className = 'puntito' + (i === indiceActual ? ' activo' : '');
        puntito.onclick = (e) => {
            e.stopPropagation();
            irAFoto(i);
        };
        puntitosContainer.appendChild(puntito);
    });
    
    const flechas = document.querySelectorAll('.flecha');
    flechas.forEach(f => {
        f.style.display = fotosActuales.length > 1 ? 'block' : 'none';
    });
}

// SWIPE
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('abierto')) {
        touchStartX = e.changedTouches[0].screenX;
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('abierto')) return;
    touchEndX = e.changedTouches[0].screenX;
    manejarSwipe();
}, { passive: true });

function manejarSwipe() {
    const diferencia = touchEndX - touchStartX;
    const umbral = 50;
    if (diferencia > umbral) cambiarFotoLightbox(-1);
    else if (diferencia < -umbral) cambiarFotoLightbox(1);
}

// TECLADO
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('abierto')) return;
    if (e.key === 'ArrowLeft') cambiarFotoLightbox(-1);
    if (e.key === 'ArrowRight') cambiarFotoLightbox(1);
    if (e.key === 'Escape') cerrarLightbox();
});

// ================================
// FAQ - PREGUNTAS FRECUENTES
// ================================
function toggleFaq(boton) {
    const item = boton.parentElement;
    const estaActivo = item.classList.contains('activo');
    
    document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('activo');
    });
    
    if (!estaActivo) {
        item.classList.add('activo');
    }
}

// ================================
// BARRA - VOLVER ARRIBA
// ================================
function volverArriba() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ================================
// CARRITO DE COMPRAS (con persistencia)
// ================================
let carrito = JSON.parse(localStorage.getItem('yanbra-carrito')) || [];

function guardarCarrito() {
    localStorage.setItem('yanbra-carrito', JSON.stringify(carrito));
}

function abrirCarrito() {
    const carritoLateral = document.getElementById('carritoLateral');
    const overlay = document.getElementById('carritoOverlay');
    if (carritoLateral && overlay) {
        carritoLateral.classList.add('abierto');
        overlay.classList.add('abierto');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarCarrito() {
    const carritoLateral = document.getElementById('carritoLateral');
    const overlay = document.getElementById('carritoOverlay');
    if (carritoLateral && overlay) {
        carritoLateral.classList.remove('abierto');
        overlay.classList.remove('abierto');
        document.body.style.overflow = '';
    }
}

function agregarAlCarrito(nombre, precio, imagen) {
    carrito.push({ nombre, precio, imagen });
    guardarCarrito();
    actualizarCarrito();
    abrirCarrito();
}

function agregarAlCarritoRapido(boton, nombre, precio, imagen) {
    // Agregar al carrito
    carrito.push({ nombre, precio, imagen });
    guardarCarrito();
    actualizarCarrito();
    
    // Cambiar el botón temporalmente a "✓"
    const contenidoOriginal = boton.textContent;
    boton.textContent = '✓';
    boton.classList.add('agregado');
    
    // Volver al "+" después de 1.5s
    setTimeout(() => {
        boton.textContent = contenidoOriginal;
        boton.classList.remove('agregado');
    }, 1500);
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
}

function actualizarCarrito() {
    const contenedorItems = document.getElementById('carritoItems');
    const contador = document.getElementById('carritoContador');
    const totalPrecioElem = document.getElementById('carritoTotalPrecio');
    const envioAviso = document.getElementById('envioAviso');

    if (!contenedorItems) return;

    contador.textContent = carrito.length;

    if (carrito.length === 0) {
        contenedorItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
        totalPrecioElem.textContent = '$0';
        envioAviso.textContent = '¡Agrega $30.000 para envío gratis! 🚚';
        envioAviso.style.color = '#4db6ac';
        return;
    }

    let html = '';
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;
        html += `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toLocaleString('es-CL')}</p>
                </div>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">✕</button>
            </div>
        `;
    });

    contenedorItems.innerHTML = html;
    totalPrecioElem.textContent = '$' + total.toLocaleString('es-CL');

    if (total >= 30000) {
        envioAviso.textContent = '🎉 ¡Felicitaciones! Tienes ENVÍO GRATIS.';
        envioAviso.style.color = '#4db6ac';
    } else {
        let falta = 30000 - total;
        envioAviso.textContent = `¡Te faltan $${falta.toLocaleString('es-CL')} para envío gratis! 🚚`;
        envioAviso.style.color = '#e8c674';
    }
}

function enviarPedidoInstagram() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    // Armar el mensaje
    let mensaje = "Hola Yanbra! Quiero hacer el siguiente pedido:\n\n";
    let total = 0;

    carrito.forEach(item => {
        mensaje += `- ${item.nombre} ($${item.precio.toLocaleString('es-CL')})\n`;
        total += item.precio;
    });

    mensaje += `\nTotal a pagar: $${total.toLocaleString('es-CL')}`;
    
    if (total >= 30000) {
        mensaje += " (Incluye Envío Gratis)";
    }

    // Copiar al portapapeles
    navigator.clipboard.writeText(mensaje).then(() => {
        // Mostrar aviso breve
        alert('✅ Pedido copiado. Pégalo en el chat de Instagram cuando te abra.');
        
        // Abrir Instagram
        window.open('https://ig.me/m/yanbra.cl', '_blank');
        
        // Limpiar carrito después de enviar
        carrito = [];
        guardarCarrito();
        actualizarCarrito();
    }).catch(() => {
        // Si falla el copiado, al menos abrir Instagram
        window.open('https://ig.me/m/yanbra.cl', '_blank');
    });
}

// ================================
// INICIALIZAR CARRITO AL CARGAR
// ================================
window.addEventListener('load', () => {
    actualizarCarrito();
});
