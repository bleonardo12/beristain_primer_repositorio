// Funcionalidades generales de la aplicación

class App {
    constructor() {
        this.init();
    }

    init() {
        this.initCountdown();
        this.initSmoothScroll();
        this.initAnimations();
    }

    // Inicializar countdown para envío express
    initCountdown() {
        const countdownElement = document.getElementById('countdown');
        const shippingBanner = document.getElementById('shippingBanner');

        if (!countdownElement || !shippingBanner) return;

        const updateCountdown = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentSecond = now.getSeconds();

            // Calcular tiempo restante hasta las 15hs
            const deadline = new Date();
            deadline.setHours(CONFIG.shipping.expressHour, 0, 0, 0);

            if (currentHour >= CONFIG.shipping.expressHour) {
                // Después de las 15hs, calcular para el día siguiente
                deadline.setDate(deadline.getDate() + 1);
                shippingBanner.classList.add('bg-secondary');
                shippingBanner.classList.remove('bg-success');
                document.getElementById('shippingText').textContent =
                    'Envío express disponible mañana antes de las 15hs';
            } else {
                shippingBanner.classList.add('bg-success');
                shippingBanner.classList.remove('bg-secondary');
            }

            const diff = deadline - now;

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                countdownElement.textContent =
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        };

        // Actualizar cada segundo
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Scroll suave para anclas
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offsetTop = target.offsetTop - 80; // Offset para el navbar fijo

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Animaciones al scroll
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observar elementos que queremos animar
        document.querySelectorAll('.product-card, .about-section, .contact-section').forEach(el => {
            observer.observe(el);
        });
    }

    // Función para compartir en redes sociales
    shareProduct(productId, productName) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`¡Mira estas medias locas! ${productName}`);

        const shareUrls = {
            whatsapp: `https://wa.me/?text=${text}%20${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        };

        return shareUrls;
    }

    // Función para validar email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Función para formatear teléfono
    formatPhone(phone) {
        // Eliminar caracteres no numéricos
        const cleaned = phone.replace(/\D/g, '');

        // Formatear como +54 9 11 1234-5678
        if (cleaned.length === 10) {
            return `+54 9 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
        }

        return phone;
    }

    // Mostrar mensaje de carga
    showLoading(message = 'Cargando...') {
        const loader = document.createElement('div');
        loader.id = 'appLoader';
        loader.className = 'app-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">${message}</p>
            </div>
        `;

        // Agregar estilos
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        document.body.appendChild(loader);
    }

    // Ocultar mensaje de carga
    hideLoading() {
        const loader = document.getElementById('appLoader');
        if (loader) {
            loader.remove();
        }
    }

    // Analytics (Google Analytics, Facebook Pixel, etc.)
    trackEvent(category, action, label) {
        // Implementar tracking según tu plataforma de analytics
        console.log('Event tracked:', { category, action, label });

        // Ejemplo para Google Analytics
        // if (window.gtag) {
        //     gtag('event', action, {
        //         'event_category': category,
        //         'event_label': label
        //     });
        // }
    }
}

// Agregar estilos para animaciones
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .product-card,
    .about-section,
    .contact-section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    .loader-content {
        text-align: center;
    }

    .loader-content p {
        font-weight: 600;
        color: #FF1493;
        font-size: 1.2rem;
    }
`;
document.head.appendChild(animationStyles);

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();

    // Log de bienvenida
    console.log(`
    ╔══════════════════════════════════════╗
    ║                                      ║
    ║        🧦 SOCKLOCO E-COMMERCE 🧦     ║
    ║                                      ║
    ║   Medias que hablan por vos          ║
    ║                                      ║
    ╚══════════════════════════════════════╝

    Desarrollado con ❤️ para tu emprendimiento

    📝 Configuración pendiente:
    - Agregar tu Public Key de MercadoPago en js/config.js
    - Configurar backend para procesar pagos
    - Configurar servicio de emails

    🚀 ¡Listo para vender medias locas!
    `);
});

// Manejar errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

// Prevenir comportamiento por defecto en formularios demo
document.addEventListener('submit', (e) => {
    if (e.target.tagName === 'FORM' && !e.target.hasAttribute('data-allow-submit')) {
        e.preventDefault();
    }
});
