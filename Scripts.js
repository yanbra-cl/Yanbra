// ================================
// SPLASH SCREEN
// ================================
window.addEventListener('load', () => {
    const splash = document.getElementById('splash');
    setTimeout(() => {
        splash.classList.add('oculto');
    }, 1500);
});

// ================================
// ANIMACIONES AL BAJAR
// ================================
const elementos = document.querySelectorAll('.animar');

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

// ================================
// CARRUSEL - PUNTITOS
// ================================
const carrusel = document.getElementById('carrusel');
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
    document.getElementById('lightbox-img').src = fotosActuales[indiceActual];
    document.getElementById('lightbox-titulo').textContent = tituloActual;
    document.getElementById('lightbox-contador').textContent = (indiceActual + 1) + ' / ' + fotosActuales.length;
    
    const puntitosContainer = document.getElementById('lightbox-puntitos');
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
    if (lightbox.classList.contains('abierto')) {
        touchStartX = e.changedTouches[0].screenX;
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('abierto')) return;
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
    if (!lightbox.classList.contains('abierto')) return;
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
// BARRA FLOTANTE
// ================================

// Volver arriba (al tocar el logo)
function volverArriba() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Abrir FAQ (al tocar "¿Ayuda?")
function abrirFaq() {
    const faq = document.querySelector('.footer-faq');
    if (faq) {
        faq.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
