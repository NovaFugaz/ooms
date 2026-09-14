(function () {
    'use strict';

    const state = { products: [], editingId: null };
    const currency = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
    const fields = ['productName', 'productSku', 'productStatus', 'productCategory', 'productSubcategory', 'productPrice', 'productStock', 'productMinStock', 'productLanguage', 'productReleaseDate', 'productImage', 'productDescription'];

    const $ = (id) => document.getElementById(id);

    function initialize() {
        state.products = ProductStorage.getProducts();
        bindEvents();
        populateCategoryFilter();
        render();
        resetForm();
    }

    function bindEvents() {
        $('productForm').addEventListener('submit', handleSubmit);
        $('newProductButton').addEventListener('click', resetForm);
        $('resetFormButton').addEventListener('click', resetForm);
        $('cancelEditButton').addEventListener('click', resetForm);
        $('productSearch').addEventListener('input', renderProducts);
        $('categoryFilter').addEventListener('change', renderProducts);
        $('statusFilter').addEventListener('change', renderProducts);
        $('productsTableBody').addEventListener('click', handleTableAction);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const product = readForm();
        const validationError = validateProduct(product);
        if (validationError) {
            showFeedback(validationError, 'error');
            return;
        }

        if (state.editingId) {
            ProductStorage.updateProduct(state.editingId, product);
            showFeedback('Producto actualizado correctamente.', 'success');
        } else {
            ProductStorage.createProduct(product);
            showFeedback('Producto creado correctamente.', 'success');
        }

        state.products = ProductStorage.getProducts();
        populateCategoryFilter();
        render();
        resetForm(false);
    }

    function readForm() {
        return {
            name: $('productName').value.trim(),
            sku: $('productSku').value.trim().toUpperCase(),
            status: $('productStatus').value,
            category: $('productCategory').value,
            subcategory: $('productSubcategory').value.trim(),
            price: Number($('productPrice').value),
            stock: Number($('productStock').value),
            minStock: Number($('productMinStock').value || 0),
            language: $('productLanguage').value.trim(),
            releaseDate: $('productReleaseDate').value,
            image: $('productImage').value.trim(),
            description: $('productDescription').value.trim()
        };
    }

    function validateProduct(product) {
        if (!product.name || !product.sku || !product.category) return 'Completa los campos obligatorios del producto.';
        if (!Number.isInteger(product.price) || product.price < 0 || !Number.isInteger(product.stock) || product.stock < 0 || !Number.isInteger(product.minStock) || product.minStock < 0) return 'Precio y stock deben ser números enteros iguales o mayores que cero.';
        const duplicatedSku = state.products.some((item) => item.sku.toLowerCase() === product.sku.toLowerCase() && item.id !== state.editingId);
        if (duplicatedSku) return 'El SKU ingresado ya pertenece a otro producto.';
        return '';
    }

    function render() {
        renderStats();
        renderProducts();
    }

    function renderStats() {
        const activeProducts = state.products.filter((product) => product.status === 'active');
        const lowStockProducts = state.products.filter((product) => product.stock <= product.minStock);
        const categories = new Set(state.products.map((product) => product.category).filter(Boolean));
        $('totalProducts').textContent = state.products.length;
        $('activeProducts').textContent = activeProducts.length;
        $('lowStockProducts').textContent = lowStockProducts.length;
        $('categoryCount').textContent = categories.size;
    }

    function populateCategoryFilter() {
        const selectedCategory = $('categoryFilter').value;
        const categories = [...new Set(state.products.map((product) => product.category).filter(Boolean))].sort();
        $('categoryFilter').innerHTML = '<option value="">Todas las categorías</option>';
        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            $('categoryFilter').appendChild(option);
        });
        $('categoryFilter').value = categories.includes(selectedCategory) ? selectedCategory : '';
    }

    function getFilteredProducts() {
        const search = $('productSearch').value.trim().toLowerCase();
        const category = $('categoryFilter').value;
        const status = $('statusFilter').value;
        return state.products.filter((product) => {
            const matchesSearch = !search || product.name.toLowerCase().includes(search) || product.sku.toLowerCase().includes(search);
            return matchesSearch && (!category || product.category === category) && (!status || product.status === status);
        });
    }

    function renderProducts() {
        const products = getFilteredProducts();
        $('productsTableBody').innerHTML = products.map(productRow).join('');
        $('emptyState').hidden = products.length > 0;
        $('productCountLabel').textContent = `${products.length} producto${products.length === 1 ? '' : 's'}`;
    }

    function productRow(product) {
        const stockClass = product.stock === 0 ? 'stock-empty' : product.stock <= product.minStock ? 'stock-low' : 'stock-ok';
        const stockLabel = product.stock === 0 ? 'Sin stock' : `${product.stock} unidades`;
        const statusLabel = product.status === 'active' ? 'Activo' : 'Inactivo';
        const image = product.image ? `<img src="${escapeAttribute(product.image)}" alt="">` : '<i class="bi bi-box-seam"></i>';
        return `<tr><td><div class="product-name-cell"><span class="product-thumb">${image}</span><span><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.language || 'Sin idioma')}</small></span></div></td><td>${escapeHtml(product.sku)}</td><td>${escapeHtml(product.category)}</td><td>${currency.format(product.price)}</td><td><span class="stock-badge ${stockClass}">${stockLabel}</span></td><td><span class="status-badge ${product.status === 'active' ? 'status-active' : 'status-inactive'}">${statusLabel}</span></td><td class="text-end"><button class="table-action" type="button" data-action="edit" data-id="${escapeAttribute(product.id)}" title="Editar" aria-label="Editar"><i class="bi bi-pencil"></i></button><button class="table-action delete" type="button" data-action="delete" data-id="${escapeAttribute(product.id)}" title="Eliminar" aria-label="Eliminar"><i class="bi bi-trash3"></i></button></td></tr>`;
    }

    function handleTableAction(event) {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const product = state.products.find((item) => item.id === button.dataset.id);
        if (!product) return;
        if (button.dataset.action === 'edit') fillForm(product);
        if (button.dataset.action === 'delete') deleteProduct(product);
    }

    function fillForm(product) {
        state.editingId = product.id;
        fields.forEach((field) => {
            const key = field.replace('product', '').replace(/^./, (letter) => letter.toLowerCase());
            $(field).value = product[key] ?? '';
        });
        $('formTitle').textContent = 'Editar producto';
        $('submitLabel').textContent = 'Actualizar producto';
        $('cancelEditButton').hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetForm(showMessage = true) {
        state.editingId = null;
        $('productForm').reset();
        $('productId').value = '';
        $('productStatus').value = 'active';
        $('productMinStock').value = '3';
        $('productLanguage').value = 'Español';
        $('formTitle').textContent = 'Nuevo producto';
        $('submitLabel').textContent = 'Guardar producto';
        $('cancelEditButton').hidden = true;
        if (showMessage) showFeedback('', '');
    }

    function deleteProduct(product) {
        if (!window.confirm(`¿Eliminar el producto "${product.name}"?`)) return;
        ProductStorage.deleteProduct(product.id);
        state.products = ProductStorage.getProducts();
        populateCategoryFilter();
        render();
        if (state.editingId === product.id) resetForm(false);
        showFeedback('Producto eliminado correctamente.', 'success');
    }

    function showFeedback(message, type) {
        $('feedback').textContent = message;
        $('feedback').className = `admin-feedback${type ? ` ${type}` : ''}`;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }

    document.addEventListener('DOMContentLoaded', initialize);
}());