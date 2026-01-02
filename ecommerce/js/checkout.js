// Sistema de Checkout y MercadoPago

class CheckoutManager {
    constructor() {
        this.mp = null;
        this.init();
    }

    init() {
        // Configurar botón de checkout
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.startCheckout());
        }

        // Inicializar MercadoPago SDK
        this.initMercadoPago();
    }

    // Inicializar MercadoPago
    async initMercadoPago() {
        try {
            if (validateMPConfig()) {
                this.mp = new MercadoPago(CONFIG.mercadoPago.publicKey);
            }
        } catch (error) {
            console.error('Error al inicializar MercadoPago:', error);
        }
    }

    // Iniciar proceso de checkout
    async startCheckout() {
        const items = cart.getItems();

        if (items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        // Verificar si hay envío express disponible
        const isExpressShipping = this.checkExpressShipping();

        // Crear preferencia de pago
        await this.createPaymentPreference(items, isExpressShipping);
    }

    // Verificar si aplica envío express
    checkExpressShipping() {
        const now = new Date();
        const currentHour = now.getHours();
        return currentHour < CONFIG.shipping.expressHour;
    }

    // Crear preferencia de pago en MercadoPago
    async createPaymentPreference(items, isExpressShipping) {
        try {
            // IMPORTANTE: Esta es una implementación de ejemplo
            // En producción, debes crear un backend que maneje la creación de preferencias
            // Por seguridad, nunca expongas tu Access Token en el frontend

            // Simulación de datos para el ejemplo
            const preference = {
                items: items.map(item => ({
                    title: `${item.name} - Talle ${item.size}`,
                    description: `Media ${item.name}`,
                    quantity: item.quantity,
                    unit_price: item.price,
                    currency_id: 'ARS'
                })),
                back_urls: {
                    success: `${window.location.origin}/ecommerce/success.html`,
                    failure: `${window.location.origin}/ecommerce/failure.html`,
                    pending: `${window.location.origin}/ecommerce/pending.html`
                },
                auto_return: 'approved',
                notification_url: `${window.location.origin}/api/notifications`, // Tu webhook
                metadata: {
                    express_shipping: isExpressShipping,
                    items: JSON.stringify(items)
                }
            };

            console.log('Preferencia de pago:', preference);

            // NOTA: En producción, debes hacer un POST a tu backend
            // que creará la preferencia usando tu Access Token
            /*
            const response = await fetch('/api/create-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preference)
            });

            const data = await response.json();

            if (data.id) {
                // Redirigir al checkout de MercadoPago
                this.mp.checkout({
                    preference: {
                        id: data.id
                    },
                    autoOpen: true
                });
            }
            */

            // Por ahora, mostrar formulario de checkout simulado
            this.showCheckoutForm(items, isExpressShipping);

        } catch (error) {
            console.error('Error al crear preferencia:', error);
            alert('Error al procesar el pago. Intenta nuevamente.');
        }
    }

    // Mostrar formulario de checkout (versión simplificada para demostración)
    showCheckoutForm(items, isExpressShipping) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        modal.hide();

        // Crear modal de checkout
        const checkoutModal = document.createElement('div');
        checkoutModal.className = 'modal fade';
        checkoutModal.id = 'checkoutModal';
        checkoutModal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-credit-card"></i> Finalizar Compra
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${isExpressShipping ? `
                            <div class="alert alert-success">
                                <i class="fas fa-rocket"></i>
                                <strong>¡Envío Express disponible!</strong>
                                Tu pedido será enviado hoy mismo.
                            </div>
                        ` : `
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i>
                                El envío express está disponible solo para compras antes de las 15hs.
                                Tu pedido será enviado en el próximo día hábil.
                            </div>
                        `}

                        <h5 class="mb-3">Resumen de compra</h5>
                        <div class="checkout-items">
                            ${items.map(item => `
                                <div class="d-flex justify-content-between mb-2">
                                    <span>${item.name} (${item.size}) x${item.quantity}</span>
                                    <strong>${formatPrice(item.price * item.quantity)}</strong>
                                </div>
                            `).join('')}
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between mb-3">
                            <h4>Total:</h4>
                            <h4 class="text-primary">${formatPrice(cart.getTotal())}</h4>
                        </div>

                        <h5 class="mb-3">Datos de contacto</h5>
                        <form id="checkoutForm">
                            <div class="mb-3">
                                <label class="form-label">Nombre completo *</label>
                                <input type="text" class="form-control" id="buyerName" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email *</label>
                                <input type="email" class="form-control" id="buyerEmail" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Teléfono *</label>
                                <input type="tel" class="form-control" id="buyerPhone" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Dirección de envío *</label>
                                <textarea class="form-control" id="buyerAddress" rows="2" required></textarea>
                            </div>
                        </form>

                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <strong>DEMO:</strong> Esta es una versión de demostración.
                            Para configurar MercadoPago real, sigue las instrucciones en el archivo README.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="checkoutManager.processCheckout()">
                            <i class="fas fa-check"></i> Simular Compra
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(checkoutModal);
        const newModal = new bootstrap.Modal(checkoutModal);
        newModal.show();

        // Limpiar modal cuando se cierre
        checkoutModal.addEventListener('hidden.bs.modal', () => {
            checkoutModal.remove();
        });
    }

    // Procesar checkout (versión demo)
    async processCheckout() {
        const form = document.getElementById('checkoutForm');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const buyerData = {
            name: document.getElementById('buyerName').value,
            email: document.getElementById('buyerEmail').value,
            phone: document.getElementById('buyerPhone').value,
            address: document.getElementById('buyerAddress').value
        };

        const items = cart.getItems();
        const total = cart.getTotal();
        const isExpressShipping = this.checkExpressShipping();

        // Simular envío de email
        await this.sendConfirmationEmail(buyerData, items, total, isExpressShipping);

        // Mostrar confirmación
        this.showSuccessMessage(buyerData, items, total, isExpressShipping);

        // Limpiar carrito
        cart.clearCart();

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        modal.hide();
    }

    // Enviar email de confirmación (simulado)
    async sendConfirmationEmail(buyer, items, total, expressShipping) {
        // En producción, esto debería ser un POST a tu backend
        // que envíe el email usando un servicio como SendGrid, Mailgun, etc.

        const emailData = {
            to: buyer.email,
            subject: `Confirmación de compra - ${CONFIG.store.name}`,
            body: `
                Hola ${buyer.name},

                ¡Gracias por tu compra en ${CONFIG.store.name}!

                Detalles de tu pedido:
                ${items.map(item => `- ${item.name} (${item.size}) x${item.quantity}: ${formatPrice(item.price * item.quantity)}`).join('\n')}

                Total: ${formatPrice(total)}

                ${expressShipping ? '¡Tu pedido será enviado HOY!' : 'Tu pedido será enviado en el próximo día hábil.'}

                Datos de envío:
                ${buyer.address}

                Para coordinar la entrega, contactanos:
                - WhatsApp: ${CONFIG.email.whatsapp}
                - Email: ${CONFIG.email.vendedor}
                - Instagram: ${CONFIG.email.instagram}

                ¡Gracias por tu compra!
                Equipo ${CONFIG.store.name}
            `
        };

        console.log('Email de confirmación:', emailData);

        // Simular delay de envío
        await new Promise(resolve => setTimeout(resolve, 1000));

        return true;
    }

    // Mostrar mensaje de éxito
    showSuccessMessage(buyer, items, total, expressShipping) {
        const successModal = document.createElement('div');
        successModal.className = 'modal fade';
        successModal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body text-center py-5">
                        <i class="fas fa-check-circle fa-4x text-success mb-3"></i>
                        <h3 class="mb-3">¡Compra exitosa!</h3>
                        <p class="lead">Gracias por tu compra, ${buyer.name}</p>
                        <p>Te enviamos un email a <strong>${buyer.email}</strong> con los detalles.</p>

                        <div class="alert alert-info mt-3">
                            <i class="fas fa-info-circle"></i>
                            ${expressShipping ?
                                'Tu pedido será enviado <strong>HOY</strong> mismo.' :
                                'Tu pedido será enviado en el próximo día hábil.'
                            }
                        </div>

                        <h5 class="mt-4 mb-3">Contactanos para coordinar la entrega:</h5>
                        <div class="d-grid gap-2">
                            <a href="https://wa.me/${CONFIG.email.whatsapp.replace(/[^0-9]/g, '')}"
                               class="btn btn-success btn-lg"
                               target="_blank">
                                <i class="fab fa-whatsapp"></i> WhatsApp: ${CONFIG.email.whatsapp}
                            </a>
                            <a href="mailto:${CONFIG.email.vendedor}"
                               class="btn btn-primary">
                                <i class="fas fa-envelope"></i> ${CONFIG.email.vendedor}
                            </a>
                        </div>

                        <button class="btn btn-outline-primary mt-4" onclick="location.reload()">
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(successModal);
        const modal = new bootstrap.Modal(successModal);
        modal.show();

        successModal.addEventListener('hidden.bs.modal', () => {
            successModal.remove();
        });
    }
}

// Instanciar gestor de checkout
const checkoutManager = new CheckoutManager();
