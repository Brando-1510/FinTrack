/**
 * =============================================================================
 * animations.js - Animaciones globales
 * =============================================================================
 *
 * Controla animaciones limpias de entrada:
 * - Header aparece desde arriba.
 * - Secciones aparecen desde abajo al hacer scroll.
 * - Contenido interno aparece lateralmente según su posición visual.
 *
 */

document.documentElement.classList.add('animaciones-activas');

document.addEventListener('DOMContentLoaded', function () {
    inicializarAnimacionHeader();
    inicializarAnimacionesScroll();
});

/**
 * Anima el header principal al cargar la página.
 */
function inicializarAnimacionHeader() {
    const header = document.querySelector('.navegacion-principal--index');

    if (!header) return;

    requestAnimationFrame(function () {
        header.classList.add('animacion-header-visible');
    });
}

/**
 * Inicializa animaciones de entrada por scroll.
 */
function inicializarAnimacionesScroll() {
    const usuarioPrefiereReducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const elementosAnimables = obtenerElementosAnimables();

    if (usuarioPrefiereReducirMovimiento) {
        mostrarElementosSinAnimacion(elementosAnimables);
        return;
    }

    prepararElementosAnimables(elementosAnimables);

    if (!('IntersectionObserver' in window)) {
        mostrarElementosSinAnimacion(elementosAnimables);
        return;
    }

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('animacion-visible');
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
    });

    elementosAnimables.forEach(function (elemento) {
        observador.observe(elemento);
    });
}

/**
 * Obtiene elementos del index que deben animarse.
 */
function obtenerElementosAnimables() {
    const selectores = [
        '.index-hero',
        '.index-card',
        '.index-explore',
        '.index-concepts',
        '.index-footer',

        '.index-hero__content',
        '.index-hero__panel',

        '.index-card__header',
        '.index-card__body',

        '.index-module-card',
        '.index-concept-card'
    ];

    return Array.from(document.querySelectorAll(selectores.join(', ')));
}

/**
 * Aplica clases iniciales antes de observar los elementos.
 */
function prepararElementosAnimables(elementos) {
    elementos.forEach(function (elemento, indice) {
        elemento.classList.add('animacion-scroll');

        if (esSeccionPrincipal(elemento)) {
            elemento.classList.add('animacion-desde-abajo');
            elemento.style.setProperty('--animacion-delay', '0ms');
            return;
        }

        const direccion = obtenerDireccionLateral(elemento);

        if (direccion === 'derecha') {
            elemento.classList.add('animacion-desde-derecha');
        } else {
            elemento.classList.add('animacion-desde-izquierda');
        }

        const delay = Math.min(indice * 45, 260);
        elemento.style.setProperty('--animacion-delay', delay + 'ms');
    });
}

/**
 * Define si un elemento es una sección principal.
 */
function esSeccionPrincipal(elemento) {
    return (
        elemento.classList.contains('index-hero') ||
        elemento.classList.contains('index-card') ||
        elemento.classList.contains('index-explore') ||
        elemento.classList.contains('index-concepts') ||
        elemento.classList.contains('index-footer')
    );
}

/**
 * Detecta si el elemento está visualmente a la izquierda o derecha.
 *
 * Si está a la derecha: entra desde la derecha hacia su posición.
 * Si está a la izquierda: entra desde la izquierda hacia su posición.
 */
function obtenerDireccionLateral(elemento) {
    const rect = elemento.getBoundingClientRect();
    const centroElemento = rect.left + rect.width / 2;
    const centroPantalla = window.innerWidth / 2;

    return centroElemento >= centroPantalla ? 'derecha' : 'izquierda';
}

/**
 * Fallback: muestra todo sin animación.
 */
function mostrarElementosSinAnimacion(elementos) {
    elementos.forEach(function (elemento) {
        elemento.classList.add('animacion-visible');
    });

    const header = document.querySelector('.navegacion-principal--index');

    if (header) {
        header.classList.add('animacion-header-visible');
    }
}