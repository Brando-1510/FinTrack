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
 * Funciona para:
 * - index.html
 * - cuentas.html
 * - movimientos.html
 */

document.documentElement.classList.add('animaciones-activas');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAnimacionesGlobales);
} else {
    inicializarAnimacionesGlobales();
}

function inicializarAnimacionesGlobales() {
    inicializarAnimacionHeader();
    inicializarAnimacionesScroll();
}

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

    if (elementosAnimables.length === 0) return;

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
        threshold: 0.16,
        rootMargin: '0px 0px -7% 0px'
    });

    elementosAnimables.forEach(function (elemento) {
        observador.observe(elemento);
    });
}

/**
 * Obtiene elementos animables de todas las páginas principales.
 */
function obtenerElementosAnimables() {
    const selectores = [
        /* INDEX */
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
        '.index-concept-card',

        /* CATÁLOGO DE CUENTAS */
        '.cuentas-hero',
        '.cuentas-layout',
        '.cuentas-card',
        '.cuentas-footer',
        '.cuentas-hero__content',
        '.cuentas-hero__panel',
        '.cuentas-card__header',
        '.cuentas-form__group',
        '.cuentas-form__actions',
        '.cuentas-table-card__header',
        '.cuentas-table-wrapper',
        '.cuentas-empty-state',

        /* REGISTRO DE MOVIMIENTOS */
        '.movimientos-hero',
        '.movimientos-layout',
        '.movimientos-card',
        '.movimientos-footer',
        '.movimientos-hero__content',
        '.movimientos-hero__panel',
        '.movimientos-card__header',
        '.movimientos-form__group',
        '.movimientos-lines__header',
        '.movimientos-totals',
        '.movimientos-form__actions',
        '.movimientos-table-card__header',
        '.movimientos-table-wrapper',
        '.movimientos-empty-state',
        '#contenedor-lineas > *'
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

        const delay = Math.min(indice * 35, 240);
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
        elemento.classList.contains('index-footer') ||

        elemento.classList.contains('cuentas-hero') ||
        elemento.classList.contains('cuentas-layout') ||
        elemento.classList.contains('cuentas-card') ||
        elemento.classList.contains('cuentas-footer') ||

        elemento.classList.contains('movimientos-hero') ||
        elemento.classList.contains('movimientos-layout') ||
        elemento.classList.contains('movimientos-card') ||
        elemento.classList.contains('movimientos-footer')
    );
}

/**
 * Detecta si el elemento está visualmente a la izquierda o derecha.
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