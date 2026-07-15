// ==================== GERENCIAMENTO DE DADOS ====================

// Inicialização do localStorage
const Storage = {
    CLIENTS_KEY: 'petshop_clients',
    CART_KEY: 'petshop_cart',
    
    getClients() {
        const data = localStorage.getItem(this.CLIENTS_KEY);
        return data ? JSON.parse(data) : [];
    },
    
    saveClients(clients) {
        localStorage.setItem(this.CLIENTS_KEY, JSON.stringify(clients));
    },
    
    addClient(client) {
        const clients = this.getClients();
        client.id = Date.now();
        clients.push(client);
        this.saveClients(clients);
        return client;
    },
    
    getCart() {
        const data = localStorage.getItem(this.CART_KEY);
        return data ? JSON.parse(data) : [];
    },
    
    saveCart(cart) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    },
    
    addToCart(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        this.saveCart(cart);
        return cart;
    },
    
    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
        return cart;
    },
    
    clearCart() {
        localStorage.setItem(this.CART_KEY, JSON.stringify([]));
    }
};

// Produtos padrão da loja
const defaultProducts = [
    { id: 1, name: 'Ração Premium', price: 89.90, emoji: '🐕' },
    { id: 2, name: 'Brinquedo de Corda', price: 25.50, emoji: '🎾' },
    { id: 3, name: 'Coleira com Guia', price: 45.00, emoji: '📍' },
    { id: 4, name: 'Comedouro Automático', price: 120.00, emoji: '🍽️' },
    { id: 5, name: 'Cama Confortável', price: 150.00, emoji: '🛏️' },
    { id: 6, name: 'Shampoo Pet', price: 35.90, emoji: '🧴' },
    { id: 7, name: 'Petisco Saudável', price: 18.90, emoji: '🦴' },
    { id: 8, name: 'Casinha para Gato', price: 95.00, emoji: '🏠' }
];

// ==================== NAVEGAÇÃO ====================

let currentPage = 'page1';

function navigateTo(page) {
    // Remover classe active de todas as páginas
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    // Adicionar classe active à página selecionada
    document.getElementById(page).classList.add('active');
    
    // Marcar link de navegação como ativo
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    currentPage = page;
    
    // Fechar menu hamburger
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
    
    // Atualizar conteúdo das páginas
    if (page === 'page2') {
        renderClients();
    } else if (page === 'page3') {
        renderProducts();
        updateCartCount();
    }
}

// ==================== EVENTOS DE NAVEGAÇÃO ====================

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        navigateTo(page);
    });
});

// Menu hamburger
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// ==================== PÁGINA 1: CADASTRO DE CLIENTES ====================

const clientForm = document.getElementById('clientForm');

clientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const client = {
        tutor: {
            name: document.getElementById('tutorName').value,
            phone: document.getElementById('tutorPhone').value,
            address: document.getElementById('tutorAddress').value
        },
        animal: {
            name: document.getElementById('animalName').value,
            age: document.getElementById('animalAge').value,
            size: document.getElementById('animalSize').value
        },
        attendanceDate: document.getElementById('attendanceDate').value
    };
    
    Storage.addClient(client);
    showToast('Cliente cadastrado com sucesso! ✓');
    clientForm.reset();
});

// ==================== PÁGINA 2: LISTAGEM DE CLIENTES ====================

function renderClients() {
    const clients = Storage.getClients();
    const container = document.getElementById('clientsContainer');
    
    if (clients.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum cliente cadastrado ainda.</p>';
        return;
    }
    
    container.innerHTML = clients.map((client, index) => `
        <div class="client-card" onclick="openClientModal(${index})">
            <h3>🐾 ${client.animal.name}</h3>
            <p><span class="label">Tutor:</span> ${client.tutor.name}</p>
            <p><span class="label">Data do Atendimento:</span> ${formatDate(client.attendanceDate)}</p>
        </div>
    `).join('');
}

function openClientModal(index) {
    const clients = Storage.getClients();
    const client = clients[index];
    const modal = document.getElementById('clientModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>Informações do Cliente</h2>
        <div>
            <h3 style="color: #FF6B9D; margin-top: 1rem;">Dados do Tutor</h3>
            <p><span class="label">Nome:</span> ${client.tutor.name}</p>
            <p><span class="label">Telefone:</span> ${client.tutor.phone}</p>
            <p><span class="label">Endereço:</span> ${client.tutor.address}</p>
        </div>
        <div>
            <h3 style="color: #C44569; margin-top: 1rem;">Dados do Animal</h3>
            <p><span class="label">Nome:</span> ${client.animal.name}</p>
            <p><span class="label">Idade:</span> ${client.animal.age} ano(s)</p>
            <p><span class="label">Porte:</span> ${formatPSize(client.animal.size)}</p>
        </div>
        <div>
            <h3 style="color: #FF6B9D; margin-top: 1rem;">Agendamento</h3>
            <p><span class="label">Data do Atendimento:</span> ${formatDate(client.attendanceDate)}</p>
        </div>
    `;
    
    modal.classList.add('show');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

function formatPSize(size) {
    const sizes = {
        'pequeno': 'Pequeno (até 5kg)',
        'medio': 'Médio (5kg a 15kg)',
        'grande': 'Grande (15kg a 30kg)',
        'gigante': 'Gigante (acima de 30kg)'
    };
    return sizes[size] || size;
}

// ==================== PÁGINA 3: LOJA DE PRODUTOS ====================

function renderProducts() {
    const container = document.getElementById('productsContainer');
    
    container.innerHTML = defaultProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Produto de alta qualidade para seu pet</p>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <button class="btn-primary btn-small" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId, productName, price) {
    const product = defaultProducts.find(p => p.id === productId);
    Storage.addToCart(product);
    updateCartCount();
    showToast(`${productName} adicionado ao carrinho! 🛒`);
}

function updateCartCount() {
    const cart = Storage.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// ==================== MODAL DO CARRINHO ====================

const cartModal = document.getElementById('cartModal');
const viewCartBtn = document.getElementById('viewCart');
const clearCartBtn = document.getElementById('clearCart');

viewCartBtn.addEventListener('click', () => {
    const cart = Storage.getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Carrinho vazio</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Quantidade: ${item.quantity}</p>
                    <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="btn-danger btn-small" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        `).join('');
    }
    
    updateCartTotal();
    cartModal.classList.add('show');
});

clearCartBtn.addEventListener('click', () => {
    Storage.clearCart();
    updateCartCount();
    updateCartTotal();
    document.getElementById('cartItems').innerHTML = '<p style="text-align: center; padding: 2rem;">Carrinho vazio</p>';
    showToast('Carrinho limpo! 🗑️');
});

function removeFromCart(productId) {
    Storage.removeFromCart(productId);
    updateCartCount();
    
    // Atualizar exibição do carrinho
    const cart = Storage.getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Carrinho vazio</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Quantidade: ${item.quantity}</p>
                    <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="btn-danger btn-small" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        `).join('');
    }
    
    updateCartTotal();
    showToast('Produto removido do carrinho');
}

function updateCartTotal() {
    const cart = Storage.getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalPrice').textContent = total.toFixed(2);
}

// ==================== MODAIS ====================

// Fechar modais
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.remove('show');
    });
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// ==================== NOTIFICAÇÕES (TOAST) ====================

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar página
    navigateTo('page1');
    updateCartCount();
});
