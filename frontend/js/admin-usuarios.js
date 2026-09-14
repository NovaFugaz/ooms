(function () {
    'use strict';

    const state = { users: [], editingId: null };
    const userFields = ['userName', 'userLastName', 'userEmail', 'userPhone', 'userCity', 'userRole', 'userStatus'];
    const $ = (id) => document.getElementById(id);

    function initialize() {
        state.users = UserStorage.getUsers();
        bindEvents();
        render();
        resetForm();
    }

    function bindEvents() {
        $('userForm').addEventListener('submit', handleSubmit);
        $('newUserButton').addEventListener('click', resetForm);
        $('resetUserFormButton').addEventListener('click', resetForm);
        $('cancelUserEditButton').addEventListener('click', resetForm);
        $('userSearch').addEventListener('input', renderUsers);
        $('roleFilter').addEventListener('change', renderUsers);
        $('userStatusFilter').addEventListener('change', renderUsers);
        $('usersTableBody').addEventListener('click', handleTableAction);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const user = readForm();
        const error = validateUser(user);
        if (error) {
            showFeedback(error, 'error');
            return;
        }
        if (state.editingId) {
            UserStorage.updateUser(state.editingId, user);
            showFeedback('Usuario actualizado correctamente.', 'success');
        } else {
            UserStorage.createUser(user);
            showFeedback('Usuario creado correctamente.', 'success');
        }
        state.users = UserStorage.getUsers();
        render();
        resetForm(false);
    }

    function readForm() {
        return {
            name: $('userName').value.trim(),
            lastName: $('userLastName').value.trim(),
            email: $('userEmail').value.trim().toLowerCase(),
            phone: $('userPhone').value.trim(),
            city: $('userCity').value.trim(),
            role: $('userRole').value,
            status: $('userStatus').value
        };
    }

    function validateUser(user) {
        if (!user.name || !user.lastName || !user.email) return 'Completa los campos obligatorios del usuario.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) return 'Ingresa un correo electrónico válido.';
        const duplicatedEmail = state.users.some((item) => item.email.toLowerCase() === user.email && item.id !== state.editingId);
        if (duplicatedEmail) return 'El correo ingresado ya pertenece a otro usuario.';
        return '';
    }

    function render() {
        renderStats();
        renderUsers();
    }

    function renderStats() {
        $('totalUsers').textContent = state.users.length;
        $('activeUsers').textContent = state.users.filter((user) => user.status === 'active').length;
        $('blockedUsers').textContent = state.users.filter((user) => user.status === 'blocked').length;
        $('adminUsers').textContent = state.users.filter((user) => user.role === 'admin').length;
    }

    function getFilteredUsers() {
        const search = $('userSearch').value.trim().toLowerCase();
        const role = $('roleFilter').value;
        const status = $('userStatusFilter').value;
        return state.users.filter((user) => {
            const fullName = `${user.name} ${user.lastName}`.toLowerCase();
            const matchesSearch = !search || fullName.includes(search) || user.email.toLowerCase().includes(search);
            return matchesSearch && (!role || user.role === role) && (!status || user.status === status);
        });
    }

    function renderUsers() {
        const users = getFilteredUsers();
        $('usersTableBody').innerHTML = users.map(userRow).join('');
        $('usersEmptyState').hidden = users.length > 0;
        $('userCountLabel').textContent = `${users.length} usuario${users.length === 1 ? '' : 's'}`;
    }

    function userRow(user) {
        const initials = `${user.name.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
        const roleLabel = user.role === 'admin' ? 'Administrador' : 'Cliente';
        const statusLabel = { active: 'Activo', blocked: 'Bloqueado', inactive: 'Inactivo' }[user.status];
        const registrationDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-CL') : '-';
        return `<tr><td><div class="user-name-cell"><span class="user-avatar">${escapeHtml(initials)}</span><span><strong>${escapeHtml(user.name)} ${escapeHtml(user.lastName)}</strong><small>${escapeHtml(user.city || 'Sin ciudad')}</small></span></div></td><td><span class="user-email">${escapeHtml(user.email)}</span><small class="user-contact">${escapeHtml(user.phone || 'Sin teléfono')}</small></td><td><span class="role-badge ${user.role === 'admin' ? 'role-admin' : 'role-customer'}">${roleLabel}</span></td><td>${registrationDate}</td><td><span class="status-badge ${user.status === 'active' ? 'status-active' : user.status === 'blocked' ? 'status-blocked' : 'status-inactive'}">${statusLabel}</span></td><td class="text-end"><button class="table-action" type="button" data-action="edit" data-id="${escapeAttribute(user.id)}" title="Editar" aria-label="Editar"><i class="bi bi-pencil"></i></button><button class="table-action delete" type="button" data-action="delete" data-id="${escapeAttribute(user.id)}" title="Eliminar" aria-label="Eliminar"><i class="bi bi-trash3"></i></button></td></tr>`;
    }

    function handleTableAction(event) {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const user = state.users.find((item) => item.id === button.dataset.id);
        if (!user) return;
        if (button.dataset.action === 'edit') fillForm(user);
        if (button.dataset.action === 'delete') deleteUser(user);
    }

    function fillForm(user) {
        state.editingId = user.id;
        userFields.forEach((field) => {
            const key = field.replace('user', '').replace(/^./, (letter) => letter.toLowerCase());
            $(field).value = user[key] ?? '';
        });
        $('userPassword').value = '';
        $('userFormTitle').textContent = 'Editar usuario';
        $('userSubmitLabel').textContent = 'Actualizar usuario';
        $('cancelUserEditButton').hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetForm(showMessage = true) {
        state.editingId = null;
        $('userForm').reset();
        $('userRole').value = 'customer';
        $('userStatus').value = 'active';
        $('userFormTitle').textContent = 'Nuevo usuario';
        $('userSubmitLabel').textContent = 'Guardar usuario';
        $('cancelUserEditButton').hidden = true;
        if (showMessage) showFeedback('', '');
    }

    function deleteUser(user) {
        if (!window.confirm(`¿Eliminar el usuario "${user.name} ${user.lastName}"?`)) return;
        UserStorage.deleteUser(user.id);
        state.users = UserStorage.getUsers();
        render();
        if (state.editingId === user.id) resetForm(false);
        showFeedback('Usuario eliminado correctamente.', 'success');
    }

    function showFeedback(message, type) {
        $('userFeedback').textContent = message;
        $('userFeedback').className = `admin-feedback${type ? ` ${type}` : ''}`;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }

    document.addEventListener('DOMContentLoaded', initialize);
}());