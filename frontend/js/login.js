(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('loginForm');
        if (!form) return;
        const errorBox = document.getElementById('loginError');
        const params = new URLSearchParams(window.location.search);
        if (params.get('registered') === '1') showMessage('Cuenta creada. Ahora puedes iniciar sesión.', 'success');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            form.classList.add('was-validated');
            if (!form.checkValidity()) return;
            const result = AuthStorage.login(
                document.getElementById('loginEmail').value,
                document.getElementById('loginPassword').value,
                document.getElementById('rememberMe').checked
            );
            if (!result.ok) {
                showMessage(result.message, 'error');
                return;
            }
            if (params.get('redirect') === 'checkout') {
                window.location.href = 'carrito.html';
                return;
            }
            window.location.href = result.user.role === 'admin' ? '../vista-admin/gestion-productos.html' : '../index.html';
        });

        function showMessage(message, type) {
            errorBox.textContent = message;
            errorBox.className = `alert ${type === 'success' ? 'alert-success' : 'alert-danger'}`;
        }
    });
}());
