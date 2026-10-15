// --- MANEJO DE SPLASH SCREEN ---
window.addEventListener('load', () => {
    const splash = document.getElementById('splash');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('oculto');
        }, 1200);
    }
});

// --- MENÚ LATERAL ---
function abrirMenu() {
    document.getElementById('menuLateral').classList.add('abierto');
    document.getElementById('menuOverlay').classList.add('abierto');
}

function cerrarMenu() {
    document.getElementById('menuLateral').classList.remove('abierto');
    document.getElementById('menuOverlay').classList.remove('abierto');
}

// --- CAMBIO DE FOTOS Y LIGHTBOX ---
function cambiarFoto(idPrincipal, elementoMiniatura) {
    const imgPrincipal = document.getElementById(idPrincipal);
    if (imgPrincipal) {
        imgPrincipal.src = elementoMiniatura.src;
        const contenedorMiniaturas = elementoMiniatura.parentElement;
        const miniaturas = contenedorMiniaturas.querySelectorAll('img');
        miniaturas.forEach(img => img.classList.remove('activa'));
        elementoMiniatura.classList.add('activa');
    }
}

function volverArriba() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// --- ANIMACIÓN AL BAJAR (Scroll Reveal) ---
window.addEventListener('scroll', () => {
    const elementosAnimar = document.querySelectorAll('.animar');
    elementosAnimar.forEach(elem => {
        const posicion = elem.getBoundingClientRect().top;
        const alturaPantalla = window.innerHeight;
        if (posicion < alturaPantalla - 100) {
            elem.classList.add('visible');
        }
    });
});

// --- LÓGICA DEL CARRITO HÍBRIDO ---
let carrito = [];

function abrirCarrito() {
    document.getElementById('carritoLateral').classList.add('abierto');
    document.getElementById('carritoOverlay').classList.add('abierto');
}

function cerrarCarrito() {
    document.getElementById('carritoLateral').classList.remove('abierto');
    document.getElementById('carritoOverlay').classList.remove('abierto');
}

function agregarAlCarrito(nombre, precio, imagen) {
    carrito.push({ nombre, precio, imagen });
    actualizarCarrito();
    abrirCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    const contenedorItems = document.getElementById('carritoItems');
    const contador = document.getElementById('carritoContador');
    const totalPrecioElem = document.getElementById('carritoTotalPrecio');
    const envioAviso = document.getElementById('envioAviso');

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

    // Cálculo Envío Gratis ($30.000)
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

    let mensaje = "Hola Yanbra! 👋 Quiero hacer el siguiente pedido:%0A%0A";
    let total = 0;

    carrito.forEach(item => {
        mensaje += `- ${item.nombre} ($${item.precio.toLocaleString('es-CL')})%0A`;
        total += item.precio;
    });

    mensaje += `%0A*Total a pagar: $${total.toLocaleString('es-CL')}*`;
    
    if (total >= 30000) {
        mensaje += " (Incluye Envío Gratis 🚚)";
    }

    window.open(`https://ig.me/m/yanbra.cl?text=${mensaje}`, '_blank');
}
