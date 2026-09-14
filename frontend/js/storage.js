(function () {
    'use strict';

    const STORAGE_KEYS = { products: 'ooms_products', users: 'ooms_users' };

    function readProducts() {
        try {
            const storedProducts = localStorage.getItem(STORAGE_KEYS.products);
            return storedProducts ? JSON.parse(storedProducts) : [];
        } catch (error) {
            console.error('No se pudieron leer los productos.', error);
            return [];
        }
    }

    function writeProducts(products) {
        localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    }

    function readUsers() {
        try {
            const storedUsers = localStorage.getItem(STORAGE_KEYS.users);
            return storedUsers ? JSON.parse(storedUsers) : [];
        } catch (error) {
            console.error('No se pudieron leer los usuarios.', error);
            return [];
        }
    }

    function writeUsers(users) {
        localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    }

    function createId() {
        return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function createUserId() {
        return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    window.ProductStorage = {
        getProducts: readProducts,
        saveProducts: writeProducts,
        createProduct(product) {
            const products = readProducts();
            const newProduct = { ...product, id: createId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            writeProducts([newProduct, ...products]);
            return newProduct;
        },
        updateProduct(id, product) {
            const products = readProducts();
            const index = products.findIndex((item) => item.id === id);
            if (index === -1) return null;
            products[index] = { ...products[index], ...product, id, updatedAt: new Date().toISOString() };
            writeProducts(products);
            return products[index];
        },
        deleteProduct(id) {
            const products = readProducts();
            const filteredProducts = products.filter((item) => item.id !== id);
            writeProducts(filteredProducts);
            return filteredProducts.length !== products.length;
        },
        getUsers: readUsers,
        createUser(user) {
            const users = readUsers();
            const newUser = { ...user, id: createUserId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            writeUsers([newUser, ...users]);
            return newUser;
        },
        updateUser(id, user) {
            const users = readUsers();
            const index = users.findIndex((item) => item.id === id);
            if (index === -1) return null;
            users[index] = { ...users[index], ...user, id, updatedAt: new Date().toISOString() };
            writeUsers(users);
            return users[index];
        },
        deleteUser(id) {
            const users = readUsers();
            const filteredUsers = users.filter((item) => item.id !== id);
            writeUsers(filteredUsers);
            return filteredUsers.length !== users.length;
        }
    };

    window.UserStorage = {
        getUsers: readUsers,
        createUser(user) {
            const users = readUsers();
            const newUser = { ...user, id: createUserId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            writeUsers([newUser, ...users]);
            return newUser;
        },
        updateUser(id, user) {
            const users = readUsers();
            const index = users.findIndex((item) => item.id === id);
            if (index === -1) return null;
            users[index] = { ...users[index], ...user, id, updatedAt: new Date().toISOString() };
            writeUsers(users);
            return users[index];
        },
        deleteUser(id) {
            const users = readUsers();
            const filteredUsers = users.filter((item) => item.id !== id);
            writeUsers(filteredUsers);
            return filteredUsers.length !== users.length;
        }
    };
}());