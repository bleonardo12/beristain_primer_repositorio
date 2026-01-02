// Sistema de Carrito de Compras

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.modal = null;
        this.init();
    }

    init() {
        this.modal = new bootstrap.Modal(document.getElementById('cartModal'));
        this.updateCartCount();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Abrir carrito
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.showCart());
        }
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('socklocoCart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    // Cargar carrito desde localStorage
    loadCart() {
        const saved = localStorage.getItem('socklocoCart');
        return saved ? JSON.parse(saved) : [];
    }

    // Agregar producto al carrito
    addItem(product, size, quantity = 1) {
        // Buscar si el producto ya está en el carrito con el mismo talle
        const existingItem = this.items.find(
            item => item.id === product.id && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size,
                quantity: quantity,
                category: product.category
            });
        }

        this.saveCart();
        this.showNotification(`¡${product.name} agregado al carrito!`);
        return true;
    }

    // Remover producto del carrito
    removeItem(productId, size) {
        this.items = this.items.filter(
            item => !(item.id === productId && item.size === size)
        );
        this.saveCart();
        this.renderCart();
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, size, newQuantity) {
        const item = this.items.find(
            item => item.id === productId && item.size === size
        );

        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId, size);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.renderCart();
            }
        }
    }

    // Calcular total del carrito
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Obtener cantidad total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Actualizar contador del carrito
    updateCartCount() {
        const countElement = document.getElementById('cartCount');
        if (countElement) {
            const count = this.getTotalItems();
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    // Mostrar carrito
    showCart() {
        this.renderCart();
        this.modal.show();
    }

    // Renderizar carrito
    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const totalElement = document.getElementById('cartTotal');

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCart.classList.remove('d-none');
            totalElement.textContent = formatPrice(0);
            return;
        }

        emptyCart.classList.add('d-none');

        const cartHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <div class="cart-item-details">
                        Talle: ${item.size}
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="cart.updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button onclick="cart.updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-price">
                    ${formatPrice(item.price * item.quantity)}
                </div>
                <button class="btn-remove" onclick="cart.removeItem(${item.id}, '${item.size}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        cartItemsContainer.innerHTML = cartHTML;
        totalElement.textContent = formatPrice(this.getTotal());
    }

    // Limpiar carrito
    clearCart() {
        this.items = [];
        this.saveCart();
        this.renderCart();
    }

    // Mostrar notificación
    showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;

        // Agregar estilos inline si no existen
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #00D084, #00A86B);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
            font-weight: 600;
        `;

        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Obtener items del carrito (para checkout)
    getItems() {
        return this.items;
    }
}

// Agregar animaciones para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Instanciar carrito globalmente
const cart = new ShoppingCart();
