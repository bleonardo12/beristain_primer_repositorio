// Configuración de SockLoco E-commerce

const CONFIG = {
    // MercadoPago Configuration
    // IMPORTANTE: Reemplazar con tu Public Key de MercadoPago
    // Obtener en: https://www.mercadopago.com.ar/settings/account/credentials
    mercadoPago: {
        publicKey: 'TEST-tu-public-key-aqui', // Cambiar por tu public key
        // Para producción, cambiar a tu public key real (no test)
    },

    // Email Configuration
    // Para envío de emails post-compra
    email: {
        vendedor: 'ventas@sockloco.com.ar',
        nombre: 'SockLoco',
        whatsapp: '+54 9 11 1234-5678',
        instagram: '@sockloco.ar'
    },

    // Shipping Configuration
    shipping: {
        expressHour: 15, // Hora límite para envío express (15hs)
        expressAvailable: true
    },

    // Store Information
    store: {
        name: 'SockLoco',
        slogan: 'Medias que hablan por vos',
        currency: '$',
        country: 'Argentina'
    }
};

// Función para formatear precios
function formatPrice(price) {
    return `${CONFIG.store.currency}${price.toLocaleString('es-AR')}`;
}

// Función para validar configuración de MercadoPago
function validateMPConfig() {
    if (CONFIG.mercadoPago.publicKey === 'TEST-tu-public-key-aqui') {
        console.warn('⚠️ IMPORTANTE: Debes configurar tu Public Key de MercadoPago en js/config.js');
        return false;
    }
    return true;
}
