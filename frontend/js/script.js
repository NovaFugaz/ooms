(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        if (searchForm && searchInput) {
            searchForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const query = searchInput.value.trim();
                const catalogPath = window.location.pathname.includes('/vista-usuario/') ? 'productos.html' : 'vista-usuario/productos.html';
                window.location.href = query ? `${catalogPath}?buscar=${encodeURIComponent(query)}` : catalogPath;
            });
        }
    });
}());
