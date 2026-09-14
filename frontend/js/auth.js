(function () {
    'use strict';

    const SESSION_KEY = 'ooms_current_user';

    function normalizeEmail(email) {
        return email.trim().toLowerCase();
    }

    function register(user) {
        const users = UserStorage.getUsers();
        const email = normalizeEmail(user.email);
        if (users.some((item) => item.email.toLowerCase() === email)) {
            return { ok: false, message: 'Ya existe una cuenta con ese correo electrónico.' };
        }
        const createdUser = UserStorage.createUser({
            name: user.name.trim(),
            lastName: user.lastName.trim(),
            email,
            phone: user.phone.trim(),
            city: user.city || '',
            password: user.password,
            role: 'customer',
            status: 'active'
        });
        return { ok: true, user: createdUser };
    }

    function login(email, password, remember) {
        const user = UserStorage.getUsers().find((item) => item.email.toLowerCase() === normalizeEmail(email) && item.password === password);
        if (!user) return { ok: false, message: 'Correo o contraseña incorrectos.' };
        if (user.status !== 'active') return { ok: false, message: 'Esta cuenta no está activa.' };
        const session = { id: user.id, name: user.name, lastName: user.lastName, email: user.email, role: user.role };
        if (remember) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        else sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return { ok: true, user: session };
    }

    function getCurrentUser() {
        try {
            const stored = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            return null;
        }
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
    }

    window.AuthStorage = { register, login, getCurrentUser, logout };
}());
