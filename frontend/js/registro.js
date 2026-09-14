(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('registroForm');
        if (!form) return;
        const errorBox = document.getElementById('registroError');
        const password = document.getElementById('regPassword');
        const confirmation = document.getElementById('regPasswordConfirm');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            confirmation.setCustomValidity(password.value !== confirmation.value ? 'Las contraseñas no coinciden.' : '');
            form.classList.add('was-validated');
            if (!form.checkValidity()) return;
            const result = AuthStorage.register({
                name: document.getElementById('regNombre').value,
                lastName: document.getElementById('regApellido').value,
                email: document.getElementById('regEmail').value,
                phone: document.getElementById('regTelefono').value,
                password: password.value
            });
            if (!result.ok) {
                showError(result.message);
                return;
            }
            window.location.href = 'login.html?registered=1';
        });

        confirmation.addEventListener('input', () => {
            confirmation.setCustomValidity(password.value !== confirmation.value ? 'Las contraseñas no coinciden.' : '');
        });

        function showError(message) {
            errorBox.textContent = message;
            errorBox.classList.remove('d-none');
        }
    });
}());
