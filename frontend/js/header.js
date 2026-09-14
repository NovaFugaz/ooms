(function () {
    'use strict';

    function updateHeader() {
        var accountLinks = document.querySelector('.account-links');
        if (!accountLinks) return;

        var user = window.AuthStorage.getCurrentUser();

        if (user) {
            var displayName = user.name || 'Usuario';
            accountLinks.innerHTML =
                '<a href="#">Tu perfil</a>' +
                '<span>|</span>' +
                '<a href="#" id="logoutLink">Cerrar sesión</a>';

            var logoutLink = document.getElementById('logoutLink');
            if (logoutLink) {
                logoutLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    window.AuthStorage.logout();
                    window.location.reload();
                });
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateHeader);
    } else {
        updateHeader();
    }
})();