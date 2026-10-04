// ================================
// MENÚ HAMBURGUESA
// ================================
function abrirMenu() {
    const menu = document.getElementById('menuLateral');
    const overlay = document.getElementById('menuOverlay');
    menu.classList.add('abierto');
    overlay.classList.add('abierto');
    document.body.style.overflow = 'hidden';
}

function cerrarMenu() {
    const menu = document.getElementById('menuLateral');
    const overlay = document.getElementById('menuOverlay');
    menu.classList.remove('abierto');
    overlay.classList.remove('abierto');
    document.body.style.overflow = '';
}

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
// ANIMACIONES AL BAJAR
// ================================
const elementos = document.querySelectorAll('.animar');

if (elementos.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    elementos.forEach(el => observer.observe(el));
}

// ================================
// CARRUSEL "LO ÚLTIMO"
// ================================
const carruselUltimo = document.getElementById('carrusel-ultimo');

if (carruselUltimo) {
    const productosUltimo = carruselUltimo.querySelectorAll('.producto');
    const puntitosUltimo = document.getElementById('carrusel-puntitos-ultimo');

    productosUltimo.forEach((producto, i) => {
        const puntito = document.createElement('div');
        puntito.className = 'carrusel-puntito' + (i === 0 ? ' activo' : '');
        puntito.onclick = () => {
            const anchoProducto = carruselUltimo.firstElementChild.offsetWidth;
            const gap = 20;
            carruselUltimo.scrollTo({ left: i * (anchoProducto + gap), behavior: 'smooth' });
        };
        puntitosUltimo.appendChild(puntito);
    });

    carruselUltimo.addEventListener('scroll', () => {
        const anchoProducto = carruselUltimo.firstElementChild.offsetWidth;
        const gap = 20;
        const indice = Math.round(carruselUltimo.scrollLeft / (anchoProducto + gap));
        
        const todosPuntitos = puntitosUltimo.querySelectorAll('.carrusel-puntito');
        todosPuntitos.forEach((p, i) => {
            p.classList.toggle('activo', i === indice);
        });
    });
}

// ================================
// CARRUSEL CATÁLOGO
// ================================
const carrusel = document.getElementById('carrusel');

if (carrusel) {
    const productos = carrusel.querySelectorAll('.producto');
    const puntitosCarrusel = document.getElementById('carrusel-puntitos');

    productos.forEach((producto, i) => {
        const puntito = document.createElement('div');
        puntito.className = 'carrusel-puntito' + (i === 0 ? ' activo' : '');
        puntito.onclick = () => {
            const anchoProducto = carrusel.firstElementChild.offsetWidth;
            const gap = 20;
            carrusel.scrollTo({ left: i * (anchoProducto + gap), behavior: 'smooth' });
        };
        puntitosCarrusel.appendChild(puntito);
    });

    carrusel.addEventListener('scroll', () => {
        const anchoProducto = carrusel.firstElementChild.offsetWidth;
        const gap = 20;
        const indice = Math.round(carrusel.scrollLeft / (anchoProducto + gap));
        
        const todosPuntitos = puntitosCarrusel.querySelectorAll('.carrusel-puntito');
        todosPuntitos.forEach((p, i) => {
            p.classList.toggle('activo', i === indice);
        });
    });
}

// ================================
// CAMBIAR FOTO DE GALERÍA
// ================================
function cambiarFoto(idPrincipal, miniatura) {
    document.getElementById(idPrincipal).src = miniatura.src;
    const miniaturas = miniatura.parentElement.querySelectorAll('img');
    miniaturas.forEach(img => img.classList.remove('activa'));
    miniatura.classList.add('activa');
}

// ================================
// LIGHTBOX CON SWIPE
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
