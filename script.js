document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    cargarReseñas();
    actualizarIconoCarrito();
    actualizarSidebarCarrito();  // Aseguramos que se actualice el carrito al cargar la página
});

// Cargar productos desde la API
function cargarProductos() {
    const productList = document.getElementById("product-list");

    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(data => {
            productList.innerHTML = data.map(product => `
                <div class="card">
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p><strong>$${product.price}</strong></p>
                    <p class="description" style="display: none;">${product.description}</p>
                    <button class="expand-btn">Leer más</button>
                    <button onclick="añadirAlCarrito(${product.id}, \`${product.title}\`, ${product.price})">
                        Añadir al carrito
                    </button>
                </div>
            `).join("");

            // Configurar botones de "Leer más"
            configurarBotonesExpand();
        })
        .catch(error => console.error("Error fetching products:", error));
}

// Configurar botones "Leer más" para mostrar la descripción del producto
function configurarBotonesExpand() {
    const expandButtons = document.querySelectorAll('.expand-btn');
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const description = button.previousElementSibling;
            if (description.style.display === 'none') {
                description.style.display = 'block';
                button.textContent = 'Leer menos';
            } else {
                description.style.display = 'none';
                button.textContent = 'Leer más';
            }
        });
    });
}

// Añadir productos al carrito
function añadirAlCarrito(id, title, price) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existingItem = carrito.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        carrito.push({ id, title, price, quantity: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarIconoCarrito();
    actualizarSidebarCarrito();  // Actualizar el sidebar al agregar un producto
}

// Actualizar el ícono del carrito con el número total de artículos
function actualizarIconoCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById("carrito-count");
    if (cartCount) {
        cartCount.textContent = totalItems;  // Actualizar contador
    }
}

// Actualizar el contenido del sidebar con los productos en el carrito
function actualizarSidebarCarrito() {
    const carritoContainer = document.getElementById("carrito-container");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        carritoContainer.innerHTML = '<p>Tu carrito está vacío</p><button onclick="vaciarCarrito()">Vaciar carrito</button>';
        return;
    }

    carritoContainer.innerHTML = carrito.map(item => `
        <div class="producto">
            <p>${item.title} - $${item.price} x ${item.quantity}</p>
            <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        </div>
    `).join("");

    carritoContainer.innerHTML += '<button onclick="vaciarCarrito()">Vaciar carrito</button>';
}

// Eliminar un producto del carrito
function eliminarDelCarrito(id) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const updatedCarrito = carrito.filter(item => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(updatedCarrito));

    actualizarIconoCarrito();
    actualizarSidebarCarrito();
}

// Vaciar todo el carrito
function vaciarCarrito() {
    localStorage.removeItem("carrito");
    actualizarIconoCarrito();
    actualizarSidebarCarrito();  // Aseguramos que el sidebar se actualice cuando se vacíe el carrito
}

// Abrir o cerrar el sidebar del carrito
function toggleCarrito() {
    const carritoSidebar = document.getElementById("carrito-sidebar");
    carritoSidebar.classList.toggle("open");
}

// Cerrar el sidebar del carrito
function closeSidebar() {
    const carritoSidebar = document.getElementById("carrito-sidebar");
    carritoSidebar.classList.remove("open");
}

// Función para manejar las reseñas
function cargarReseñas() {
    const reseñasContainer = document.getElementById("reseñas-container");
    fetch("datos/resenias.json")
        .then(response => response.json())
        .then(reseñas => {
            reseñasContainer.innerHTML = reseñas.map(reseña => `
                <div class="reseña">
                    <h4>${reseña.autor}</h4>
                    <p>"${reseña.texto}"</p>
                </div>
            `).join("");
        })
        .catch(error => console.error("Error loading reseñas:", error));
}