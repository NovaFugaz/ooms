(function () {
    'use strict';

    const BASE_PRODUCTS = [
        {
            id: 'base-catan',
            name: 'Catan',
            sku: 'JDM-001',
            category: 'Juegos de mesa',
            subcategory: 'Estrategia',
            price: 34990,
            stock: 8,
            minStock: 2,
            language: 'Español',
            image: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/PXL_20230226_231727215_Catan_Legend_of_the_Conquerors_board_game.jpg',
            description: 'Construye, comercia y coloniza la isla de Catan.',
            status: 'active'
        },
        {
            id: 'base-ticket-to-ride',
            name: 'Ticket to Ride',
            sku: 'JDM-002',
            category: 'Juegos de mesa',
            subcategory: 'Familiares',
            price: 39990,
            stock: 6,
            minStock: 2,
            language: 'Español',
            image: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Ticket_to_Ride_%2816298587785%29.jpg',
            description: 'Completa rutas ferroviarias y conecta ciudades.',
            status: 'active'
        },
        {
            id: 'base-azul',
            name: 'Azul',
            sku: 'JDM-003',
            category: 'Juegos de mesa',
            subcategory: 'Familiares',
            price: 32990,
            stock: 5,
            minStock: 2,
            language: 'Español',
            image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/A_four-player_game_of_the_board_game_Azul.jpg',
            description: 'Crea el mosaico más elegante con azulejos portugueses.',
            status: 'active'
        },
        {
            id: 'base-pokemon-tcg',
            name: 'Pokémon TCG - Colección',
            sku: 'TCG-001',
            category: 'TCG',
            subcategory: 'Pokémon',
            price: 24990,
            stock: 10,
            minStock: 3,
            language: 'Español',
            image: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Pokemon_collection.jpg',
            description: 'Cartas y accesorios para ampliar tu colección Pokémon.',
            status: 'active'
        },
        {
            id: 'base-magic-commander',
            name: 'Magic: The Gathering Commander',
            sku: 'TCG-002',
            category: 'TCG',
            subcategory: 'Magic: The Gathering',
            price: 54990,
            stock: 4,
            minStock: 2,
            language: 'Inglés',
            image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Magic_the_Gathering_Commander_battlefield_example.jpg',
            description: 'Formato multijugador para enfrentamientos épicos de Magic.',
            status: 'active'
        },
        {
            id: 'base-dice-set',
            name: 'Set de dados para rol',
            sku: 'ACC-001',
            category: 'Accesorios',
            subcategory: 'Dice sets',
            price: 8990,
            stock: 15,
            minStock: 4,
            language: 'Universal',
            image: 'https://upload.wikimedia.org/wikipedia/commons/8/85/DnD_Dice_Set.jpg',
            description: 'Set poliédrico para tus partidas de rol.',
            status: 'active'
        },
        {
            id: 'base-dnd-notebook',
            name: 'Cuaderno de Dungeon Master',
            sku: 'TTRPG-001',
            category: 'TTRPG',
            subcategory: 'Dungeons & Dragons',
            price: 12990,
            stock: 7,
            minStock: 2,
            language: 'Inglés',
            image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/AD%26D_Dungeon_Masters_notebook.jpg',
            description: 'Organiza campañas, mapas y aventuras para tu mesa.',
            status: 'active'
        },
        {
            id: 'base-puzzle-1000',
            name: 'Puzzle Palacio de Westminster 1000 piezas',
            sku: 'PZL-001',
            category: 'Rompecabezas',
            subcategory: '1000 piezas',
            price: 15990,
            stock: 9,
            minStock: 3,
            language: 'Universal',
            image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_-_1000_piece_jigsaw_puzzle.jpg',
            description: 'Rompecabezas de 1000 piezas para disfrutar en calma.',
            status: 'active'
        },
        {
            id: 'base-puzzle-table',
            name: 'Puzzle en proceso',
            sku: 'PZL-002',
            category: 'Rompecabezas',
            subcategory: '500 piezas',
            price: 10990,
            stock: 11,
            minStock: 3,
            language: 'Universal',
            image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Jigsaw_puzzle_in_progress.jpg',
            description: 'Una experiencia clásica para compartir o disfrutar a solas.',
            status: 'active'
        },
        {
            id: 'base-magic-card',
            name: 'Magic: The Gathering - Carta coleccionable',
            sku: 'TCG-003',
            category: 'TCG',
            subcategory: 'Magic: The Gathering',
            price: 4990,
            stock: 20,
            minStock: 5,
            language: 'Inglés',
            image: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/A_Magic_the_Gathering_proxy_card_of_Cuombajj_Witches_in_a_collage_style.png',
            description: 'Carta para construir y personalizar tu mazo.',
            status: 'active'
        }
    ];

    const currency = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
    const state = { products: [], catalogProducts: [] };
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    function initialize() {
        let storedProducts = ProductStorage.getProducts();
        if (!storedProducts.length) {
            ProductStorage.saveProducts(BASE_PRODUCTS);
            storedProducts = ProductStorage.getProducts();
        }
        state.products = storedProducts;
        state.catalogProducts = state.products;
        bindCartEvents();
        bindCatalogEvents();
        bindDetailEvents();
        initializeSearchParams();
        renderCatalog();
        renderDetail();
        renderCart();
    }

    function bindCartEvents() {
        ['#cartItems', '#cartPageItems'].forEach((selector) => {
            const container = $(selector);
            if (container) container.addEventListener('click', handleCartAction);
            if (container) container.addEventListener('change', handleCartQuantityChange);
        });
        ['#checkoutButton', '#pageCheckoutButton'].forEach((selector) => {
            const button = $(selector);
            if (button) button.addEventListener('click', handleCheckout);
        });
        const clearButton = $('#clearCartButton');
        if (clearButton) clearButton.addEventListener('click', clearCart);
    }

    function bindCatalogEvents() {
        const catalog = $('#productList') || $('#catalogProductList');
        if (catalog) catalog.addEventListener('click', handleCatalogAction);
        const search = $('#catalogSearch');
        if (search) search.addEventListener('input', renderCatalog);
        const category = $('#catalogCategory');
        if (category) category.addEventListener('change', renderCatalog);
    }

    function bindDetailEvents() {
        const detail = $('#productDetail');
        if (detail) detail.addEventListener('click', handleCatalogAction);
    }

    function initializeSearchParams() {
        const params = new URLSearchParams(window.location.search);
        const search = $('#catalogSearch');
        const category = $('#catalogCategory');
        state.catalogCategoryParam = params.get('categoria') || '';
        state.catalogSubcategoryParam = params.get('subcategoria') || '';
        if (search && params.get('buscar')) search.value = params.get('buscar');
        if (category && state.catalogCategoryParam) category.value = state.catalogCategoryParam;
    }

    function handleCatalogAction(event) {
        const button = event.target.closest('[data-action="add-to-cart"]');
        if (!button) return;
        const product = state.products.find((item) => item.id === button.dataset.productId);
        if (!product) return;
        const result = CartStorage.addItem(product);
        showCatalogFeedback(result.ok ? 'Producto agregado al carrito.' : 'No hay stock suficiente para agregar este producto.', result.ok ? 'success' : 'error');
        renderCart();
    }

    function renderCatalog() {
        const catalog = $('#productList') || $('#catalogProductList');
        if (!catalog) return;
        const search = ($('#catalogSearch')?.value || '').trim().toLowerCase();
        const category = $('#catalogCategory')?.value || state.catalogCategoryParam || '';
        const products = state.catalogProducts.filter((product) => {
            if (product.status === 'inactive') return false;
            const matchesSearch = !search || product.name.toLowerCase().includes(search) || product.sku.toLowerCase().includes(search);
            const matchesCategory = !category || normalizeSlug(product.category) === normalizeSlug(category);
            const productSubcategory = normalizeSlug(product.subcategory);
            const requestedSubcategory = normalizeSlug(state.catalogSubcategoryParam);
            const matchesSubcategory = !requestedSubcategory || productSubcategory === requestedSubcategory || productSubcategory.includes(requestedSubcategory);
            return matchesSearch && matchesCategory && matchesSubcategory;
        });
        catalog.innerHTML = products.length ? products.map(productCard).join('') : '<div class="catalog-empty"><i class="bi bi-box-seam"></i><h3>No hay productos disponibles</h3><p>Los productos creados desde administración aparecerán aquí.</p></div>';
        populateCatalogCategories();
    }

    function populateCatalogCategories() {
        const select = $('#catalogCategory');
        if (!select) return;
        const selected = select.value;
        const categories = [...new Set(state.products.map((product) => product.category).filter(Boolean))].sort();
        select.innerHTML = '<option value="">Todas las categorías</option>';
        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
        select.value = categories.includes(selected) ? selected : categories.find((category) => normalizeSlug(category) === normalizeSlug(state.catalogCategoryParam)) || '';
    }

    function normalizeSlug(value) {
        return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function productCard(product) {
        const outOfStock = Number(product.stock) <= 0;
        const image = product.image ? `<img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.name)}">` : '<i class="bi bi-box-seam"></i>';
        return `<article class="col-md-6 col-xl-4"><div class="card product-card h-100"><div class="product-card-image">${image}</div><div class="card-body"><span class="category">${escapeHtml(product.category || 'Producto')}</span><h3 class="card-title">${escapeHtml(product.name)}</h3><p class="card-text">${escapeHtml(product.description || 'Producto disponible en Out of Mana.')}</p><div class="product-card-footer"><strong class="price">${currency.format(product.price)}</strong><div class="product-card-actions"><a class="btn btn-outline-dark btn-sm" href="detalle-producto.html?id=${encodeURIComponent(product.id)}" aria-label="Ver detalle de ${escapeAttribute(product.name)}"><i class="bi bi-eye"></i></a><button class="btn btn-gold btn-sm" type="button" data-action="add-to-cart" data-product-id="${escapeAttribute(product.id)}" ${outOfStock ? 'disabled' : ''}>${outOfStock ? 'Sin stock' : '<i class="bi bi-cart-plus"></i> Agregar'}</button></div></div></div></div></article>`;
    }

    function renderDetail() {
        const detail = $('#productDetail');
        if (!detail) return;
        const productId = new URLSearchParams(window.location.search).get('id');
        const product = state.products.find((item) => item.id === productId && item.status !== 'inactive');
        if (!product) {
            detail.hidden = true;
            $('#productDetailEmpty').hidden = false;
            return;
        }
        const image = product.image ? `<img src="${escapeAttribute(product.image)}" alt="${escapeAttribute(product.name)}">` : '<i class="bi bi-box-seam"></i>';
        detail.innerHTML = `<div class="product-detail-image">${image}</div><div class="product-detail-content"><span class="category">${escapeHtml(product.category)}</span><h1>${escapeHtml(product.name)}</h1><p class="product-detail-description">${escapeHtml(product.description || 'Producto disponible en Out of Mana.')}</p><div class="product-detail-meta"><span>SKU: ${escapeHtml(product.sku)}</span><span>Idioma: ${escapeHtml(product.language || 'No especificado')}</span><span>Stock disponible: ${product.stock}</span></div><strong class="product-detail-price">${currency.format(product.price)}</strong><button class="btn btn-gold" type="button" data-action="add-to-cart" data-product-id="${escapeAttribute(product.id)}" ${product.stock <= 0 ? 'disabled' : ''}><i class="bi bi-cart-plus"></i> ${product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}</button><a class="back-to-catalog" href="productos.html"><i class="bi bi-arrow-left"></i> Volver al catálogo</a></div>`;
        detail.hidden = false;
        $('#productDetailEmpty').hidden = true;
    }

    function renderCart() {
        const cart = CartStorage.getCart();
        const count = CartStorage.getItemCount();
        const total = CartStorage.getTotal();
        $$('#cartCount, #pageCartCount').forEach((element) => { element.textContent = count; });
        $$('#cartTotal, #pageCartTotal, #pageCartTotalCopy').forEach((element) => { element.textContent = currency.format(total); });
        const sidebar = $('#cartItems');
        if (sidebar) renderCartItems(sidebar, cart, true);
        const page = $('#cartPageItems');
        if (page) renderCartItems(page, cart, false);
        $$('#cartEmpty, #pageCartEmpty').forEach((element) => { element.hidden = cart.length > 0; });
        $$('#checkoutButton, #pageCheckoutButton').forEach((button) => { button.disabled = cart.length === 0; });
    }

    function renderCartItems(container, cart, compact) {
        if (!cart.length) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = cart.map((item) => `<div class="cart-item ${compact ? 'cart-item-compact' : 'cart-item-page'}"><div class="cart-item-image">${item.image ? `<img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.name)}">` : '<i class="bi bi-box-seam"></i>'}</div><div class="cart-item-info"><strong>${escapeHtml(item.name)}</strong><span>${currency.format(item.price)} c/u</span><div class="cart-item-controls"><button type="button" data-action="decrease" data-product-id="${escapeAttribute(item.productId)}" aria-label="Disminuir cantidad"><i class="bi bi-dash"></i></button><input type="number" min="1" max="${item.stock}" value="${item.quantity}" data-product-id="${escapeAttribute(item.productId)}" aria-label="Cantidad de ${escapeAttribute(item.name)}"><button type="button" data-action="increase" data-product-id="${escapeAttribute(item.productId)}" aria-label="Aumentar cantidad"><i class="bi bi-plus"></i></button><span class="cart-item-subtotal">${currency.format(item.price * item.quantity)}</span></div></div><button type="button" class="cart-remove" data-action="remove" data-product-id="${escapeAttribute(item.productId)}" aria-label="Eliminar ${escapeAttribute(item.name)}"><i class="bi bi-trash3"></i></button></div>`).join('');
    }

    function handleCartAction(event) {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const productId = button.dataset.productId;
        const item = CartStorage.getCart().find((cartItem) => cartItem.productId === productId);
        if (!item) return;
        if (button.dataset.action === 'remove') CartStorage.removeItem(productId);
        if (button.dataset.action === 'increase') updateQuantity(item, item.quantity + 1);
        if (button.dataset.action === 'decrease') item.quantity === 1 ? CartStorage.removeItem(productId) : updateQuantity(item, item.quantity - 1);
        renderCart();
    }

    function handleCartQuantityChange(event) {
        if (!event.target.matches('input[data-product-id]')) return;
        updateQuantity({ productId: event.target.dataset.productId }, event.target.value);
        renderCart();
    }

    function updateQuantity(item, quantity) {
        const result = CartStorage.updateQuantity(item.productId, quantity);
        if (!result.ok && result.reason === 'stock') showFeedback('No puedes superar el stock disponible.', 'error');
    }

    function clearCart() {
        if (!window.confirm('¿Vaciar todos los productos del carrito?')) return;
        CartStorage.clearCart();
        renderCart();
    }

    function handleCheckout() {
        if (!CartStorage.getCart().length) return;
        window.alert('Compra simulada correctamente. Gracias por comprar en Out of Mana.');
        CartStorage.clearCart();
        renderCart();
    }

    function showCatalogFeedback(message, type) {
        const feedback = $('#catalogFeedback');
        if (!feedback) return;
        feedback.textContent = message;
        feedback.className = `catalog-feedback ${type}`;
        window.setTimeout(() => { feedback.textContent = ''; feedback.className = 'catalog-feedback'; }, 2500);
    }

    function showFeedback(message, type) {
        const feedback = $('#cartFeedback');
        if (!feedback) return;
        feedback.textContent = message;
        feedback.className = `catalog-feedback ${type}`;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }

    document.addEventListener('DOMContentLoaded', initialize);
}());
