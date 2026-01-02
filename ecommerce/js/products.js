// Sistema de Productos y Filtros

class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.filters = {
            category: '',
            size: '',
            sort: '',
            search: ''
        };
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupFilters();
        this.renderProducts();
    }

    // Cargar productos desde JSON
    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            this.products = await response.json();
            this.filteredProducts = [...this.products];
        } catch (error) {
            console.error('Error al cargar productos:', error);
            this.showError('Error al cargar los productos. Por favor, recarga la página.');
        }
    }

    // Configurar event listeners para filtros
    setupFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const sizeFilter = document.getElementById('sizeFilter');
        const sortFilter = document.getElementById('sortFilter');
        const searchInput = document.getElementById('searchInput');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        if (sizeFilter) {
            sizeFilter.addEventListener('change', (e) => {
                this.filters.size = e.target.value;
                this.applyFilters();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.applyFilters();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    }

    // Aplicar filtros
    applyFilters() {
        let filtered = [...this.products];

        // Filtro por categoría
        if (this.filters.category) {
            filtered = filtered.filter(p => p.category === this.filters.category);
        }

        // Filtro por talle
        if (this.filters.size) {
            filtered = filtered.filter(p => p.sizes.includes(this.filters.size));
        }

        // Filtro por búsqueda
        if (this.filters.search) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(this.filters.search) ||
                p.description.toLowerCase().includes(this.filters.search)
            );
        }

        // Ordenamiento
        if (this.filters.sort) {
            switch (this.filters.sort) {
                case 'price-asc':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }
        }

        this.filteredProducts = filtered;
        this.renderProducts();
    }

    // Renderizar productos
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const noResults = document.getElementById('noResults');

        if (this.filteredProducts.length === 0) {
            productsGrid.innerHTML = '';
            noResults.classList.remove('d-none');
            return;
        }

        noResults.classList.add('d-none');

        const productsHTML = this.filteredProducts.map(product => `
            <div class="col-md-6 col-lg-4">
                <div class="product-card" onclick="productManager.showProductDetail(${product.id})">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.stock < 10 ? '<span class="product-badge">¡Últimas unidades!</span>' : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-category">${this.getCategoryName(product.category)}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">${formatPrice(product.price)}</div>
                        <div class="product-sizes">
                            ${product.sizes.map(size => `<span class="size-badge">${size}</span>`).join('')}
                        </div>
                        <button class="btn btn-add-cart" onclick="event.stopPropagation(); productManager.quickAddToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        productsGrid.innerHTML = productsHTML;
    }

    // Obtener nombre de categoría en español
    getCategoryName(category) {
        const categories = {
            'fantasia': 'Fantasía',
            'geek': 'Geek',
            'musica': 'Música',
            'comida': 'Comida',
            'naturaleza': 'Naturaleza',
            'deportivas': 'Deportivas',
            'animales': 'Animales',
            'arte': 'Arte'
        };
        return categories[category] || category;
    }

    // Agregar rápido al carrito (con talle por defecto M)
    quickAddToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // Si solo hay un talle, usar ese
            const defaultSize = product.sizes.length === 1 ? product.sizes[0] : 'M';

            // Si el talle M no está disponible, usar el primero disponible
            const size = product.sizes.includes(defaultSize) ? defaultSize : product.sizes[0];

            cart.addItem(product, size);
        }
    }

    // Mostrar detalle de producto
    showProductDetail(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        const modalTitle = document.getElementById('productModalTitle');
        const modalBody = document.getElementById('productModalBody');

        modalTitle.textContent = product.name;

        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
                </div>
                <div class="col-md-6">
                    <span class="badge bg-primary mb-2">${this.getCategoryName(product.category)}</span>
                    <p class="lead">${product.description}</p>
                    <h3 class="text-primary mb-3">${formatPrice(product.price)}</h3>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Selecciona tu talle:</label>
                        <div class="d-flex gap-2">
                            ${product.sizes.map(size => `
                                <button class="btn btn-outline-primary size-select-btn"
                                        data-size="${size}"
                                        onclick="document.querySelectorAll('.size-select-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');">
                                    ${size}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Cantidad:</label>
                        <div class="input-group" style="width: 150px;">
                            <button class="btn btn-outline-secondary" onclick="this.nextElementSibling.stepDown()">-</button>
                            <input type="number" class="form-control text-center" id="productQuantity" value="1" min="1" max="${product.stock}">
                            <button class="btn btn-outline-secondary" onclick="this.previousElementSibling.stepUp()">+</button>
                        </div>
                        <small class="text-muted">Stock disponible: ${product.stock} unidades</small>
                    </div>

                    <button class="btn btn-primary btn-lg w-100" onclick="productManager.addToCartFromDetail(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Agregar al carrito
                    </button>

                    <div class="mt-4">
                        <h5>Colores disponibles:</h5>
                        <p>${product.colors.join(', ')}</p>
                    </div>
                </div>
            </div>
        `;

        // Activar primer talle por defecto
        setTimeout(() => {
            const firstSizeBtn = modalBody.querySelector('.size-select-btn');
            if (firstSizeBtn) {
                firstSizeBtn.classList.add('active');
            }
        }, 100);

        modal.show();
    }

    // Agregar al carrito desde modal de detalle
    addToCartFromDetail(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const sizeBtn = document.querySelector('.size-select-btn.active');
        const quantityInput = document.getElementById('productQuantity');

        if (!sizeBtn) {
            alert('Por favor selecciona un talle');
            return;
        }

        const size = sizeBtn.dataset.size;
        const quantity = parseInt(quantityInput.value) || 1;

        cart.addItem(product, size, quantity);

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();
    }

    // Mostrar error
    showError(message) {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h3>${message}</h3>
            </div>
        `;
    }
}

// Instanciar gestor de productos
const productManager = new ProductManager();
