// Product Data - PERSONALIZA ESTOS PRODUCTOS CON LOS TUYOS
const products = [
    {
        id: 1,
        name: "Tu Producto 1",
        price: 999.99,
        category: "laptops",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80",
        description: "Descripción de tu producto 1"
    },
    {
        id: 2,
        name: "Tu Producto 2",
        price: 799.99,
        category: "phones",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        description: "Descripción de tu producto 2"
    },
    {
        id: 3,
        name: "Tu Producto 3",
        price: 599.99,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "Descripción de tu producto 3"
    }
    // AGREGA MÁS PRODUCTOS AQUÍ SIGUIENDO EL MISMO FORMATO
];

// Cart State
let cart = [];
let currentCategory = 'all';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    setupMobileMenu();
});

// Load Products
function loadProducts(category = 'all') {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Agregar al Carrito
            </button>
        </div>
    `;
    return card;
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification('Producto agregado al carrito');
}

// Update Cart Display
function updateCartDisplay() {
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white;">×</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showNotification('Producto removido del carrito');
}

// Toggle Cart
function toggleCart() {
    const cart = document.getElementById('cart');
    cart.classList.toggle('open');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Total a pagar: $${total.toFixed(2)}\n\nGracias por tu compra!`);
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    toggleCart();
}

// Filter Products
function filterProducts(category) {
    currentCategory = category;
    loadProducts(category);
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
}

// Login Modal Functions
function openLoginModal() {
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showRegisterForm() {
    const modalContent = loginModal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close" onclick="closeLoginModal()">&times;</span>
        <h2>Registrarse</h2>
        <form id="registerForm" class="login-form">
            <div class="form-group">
                <label for="regName">Nombre:</label>
                <input type="text" id="regName" required>
            </div>
            <div class="form-group">
                <label for="regEmail">Email:</label>
                <input type="email" id="regEmail" required>
            </div>
            <div class="form-group">
                <label for="regPassword">Contraseña:</label>
                <input type="password" id="regPassword" required>
            </div>
            <div class="form-group">
                <label for="regConfirmPassword">Confirmar Contraseña:</label>
                <input type="password" id="regConfirmPassword" required>
            </div>
            <button type="submit" class="btn-primary">Registrarse</button>
        </form>
        <p class="register-link">
            ¿Ya tienes cuenta? <a href="#" onclick="showLoginForm()">Inicia sesión aquí</a>
        </p>
    `;
}

function showLoginForm() {
    const modalContent = loginModal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close" onclick="closeLoginModal()">&times;</span>
        <h2>Iniciar Sesión</h2>
        <form id="loginForm" class="login-form">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input type="password" id="password" required>
            </div>
            <button type="submit" class="btn-primary">Iniciar Sesión</button>
        </form>
        <p class="register-link">
            ¿No tienes cuenta? <a href="#" onclick="showRegisterForm()">Regístrate aquí</a>
        </p>
    `;
}

// Scroll to Products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterProducts(btn.dataset.category);
        });
    });
    
    // Login form
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'loginForm') {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simulate login
            if (email && password) {
                showNotification('Inicio de sesión exitoso');
                closeLoginModal();
            } else {
                showNotification('Por favor completa todos los campos', 'error');
            }
        }
        
        if (e.target.id === 'registerForm') {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            if (password !== confirmPassword) {
                showNotification('Las contraseñas no coinciden', 'error');
                return;
            }
            
            if (name && email && password) {
                showNotification('Registro exitoso');
                closeLoginModal();
            } else {
                showNotification('Por favor completa todos los campos', 'error');
            }
        }
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeLoginModal();
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup Mobile Menu
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Add scroll animations
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(102, 126, 234, 0.95)';
    } else {
        header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}); 
