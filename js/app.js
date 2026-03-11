const MP_PUBLIC_KEY = 'TU_PUBLIC_KEY_AQUI';
const STORAGE_KEY = 'hilara_carrito';

const productos = [
    {
        id: 1,
        cat: 'ruana',
        nombre: "Ruana Alpaca Gold",
        precio: 185000,
        desc: "Lana de alpaca seleccionada con terminación premium. Tejido artesanal elegante y cálido para ocasiones especiales.",
        imgs: [
            "https://images.unsplash.com/photo-1601924921557-45e6ecd080ee?w=1200",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200",
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200"
        ]
    },
    {
        id: 2,
        cat: 'ruana',
        nombre: "Ruana Mistral",
        precio: 195000,
        desc: "Diseño sobrio con caída natural y textura envolvente. Ideal para una estética sofisticada y moderna.",
        imgs: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200",
            "https://images.unsplash.com/photo-1601924921557-45e6ecd080ee?w=1200",
            "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200"
        ]
    },
    {
        id: 3,
        cat: 'ruana',
        nombre: "Ruana Norte Beige",
        precio: 172000,
        desc: "Inspirada en el norte argentino, con tonos suaves y presencia artesanal distintiva.",
        imgs: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200"
        ]
    },
    {
        id: 4,
        cat: 'ruana',
        nombre: "Ruana Ébano",
        precio: 210000,
        desc: "Modelo de presencia fuerte y elegante, pensado para una imagen distinguida y exclusiva.",
        imgs: [
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200"
        ]
    },
    {
        id: 5,
        cat: 'ruana',
        nombre: "Ruana Arena Soft",
        precio: 168000,
        desc: "Ligera, delicada y refinada. Perfecta para combinar con looks urbanos de alta gama.",
        imgs: [
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200",
            "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200",
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200"
        ]
    },
    {
        id: 6,
        cat: 'pashmina',
        nombre: "Pashmina Seda Real",
        precio: 85000,
        desc: "Seda natural con una caída impecable y una sensación suave al tacto.",
        imgs: [
            "https://images.unsplash.com/photo-1456889419948-46c84916da65?w=1200",
            "https://images.unsplash.com/photo-1583209814613-5114a9a23bc2?w=1200",
            "https://images.unsplash.com/photo-1520633832028-3d2372fbc622?w=1200"
        ]
    },
    {
        id: 7,
        cat: 'pashmina',
        nombre: "Pashmina Nude Light",
        precio: 79000,
        desc: "Diseño minimalista y versátil para realzar cualquier conjunto con elegancia.",
        imgs: [
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200",
            "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200"
        ]
    },
    {
        id: 8,
        cat: 'pashmina',
        nombre: "Pashmina Terracota",
        precio: 89000,
        desc: "Textura cálida y tono profundo para una identidad visual distinguida.",
        imgs: [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200"
        ]
    },
    {
        id: 9,
        cat: 'pashmina',
        nombre: "Pashmina Andina",
        precio: 92000,
        desc: "Inspiración artesanal con una lectura moderna y estética de lujo.",
        imgs: [
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200",
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200",
            "https://images.unsplash.com/photo-1601924921557-45e6ecd080ee?w=1200"
        ]
    },
    {
        id: 10,
        cat: 'pashmina',
        nombre: "Pashmina Perla",
        precio: 95000,
        desc: "Modelo refinado con presencia suave y estética premium.",
        imgs: [
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200",
            "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200"
        ]
    }
];

let carrito = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
    renderStore();
    updateUI();
    initReveal();
});

function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

function goTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.add('hidden');
}

function renderStore() {
    const contR = document.getElementById('catalog-ruanas');
    const contP = document.getElementById('catalog-pashminas');

    contR.innerHTML = '';
    contP.innerHTML = '';

    productos.forEach(p => {
        const html = `
            <div class="product-card group relative overflow-hidden cursor-pointer" onclick="openModal(${p.id})">
                <img src="${p.imgs[0]}" alt="${p.nombre}" class="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition duration-1000 group-hover:scale-110">
                <div class="details-glass absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 p-5 md:p-6 text-center backdrop-blur-md border border-white/10 bg-black/60">
                    <h3 class="font-serif text-white text-lg md:text-xl italic mb-2">${p.nombre}</h3>
                    <p class="text-[#AF9662] font-semibold tracking-[0.12em] md:tracking-widest text-sm">$${p.precio.toLocaleString('es-AR')}</p>
                </div>
            </div>
        `;

        if (p.cat === 'ruana') {
            contR.innerHTML += html;
        } else {
            contP.innerHTML += html;
        }
    });
}

function openModal(id) {
    currentProduct = productos.find(x => x.id === id);
    if (!currentProduct) return;

    document.getElementById('modal-title').innerText = currentProduct.nombre;
    document.getElementById('modal-price').innerText = `$${currentProduct.precio.toLocaleString('es-AR')}`;
    document.getElementById('modal-desc').innerText = currentProduct.desc;
    document.getElementById('modal-img-main').src = currentProduct.imgs[0];

    for (let i = 0; i < 3; i++) {
        document.getElementById(`thumb-${i}`).src = currentProduct.imgs[i] || currentProduct.imgs[0];
    }

    document.getElementById('modal-talle').value = 'Único';
    document.getElementById('modal-qty').value = 1;

    const modal = document.getElementById('product-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function changeModalImg(i) {
    if (!currentProduct) return;
    document.getElementById('modal-img-main').src = currentProduct.imgs[i] || currentProduct.imgs[0];
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

function toggleCart() {
    document.getElementById('side-cart').classList.toggle('translate-x-full');
}

function addToCartFromModal() {
    if (!currentProduct) return;

    const talle = document.getElementById('modal-talle').value;
    const qty = parseInt(document.getElementById('modal-qty').value, 10);

    if (!qty || qty < 1) {
        alert('Ingrese una cantidad válida.');
        return;
    }

    const item = carrito.find(x => x.id === currentProduct.id && x.talle === talle);

    if (item) {
        item.qty += qty;
    } else {
        carrito.push({ ...currentProduct, talle, qty });
    }

    saveCart();
    updateUI();
    closeModal();
    toggleCart();
}

function updateUI() {
    const cont = document.getElementById('cart-items');
    cont.innerHTML = '';
    let total = 0;

    carrito.forEach((item, i) => {
        total += item.precio * item.qty;

        cont.innerHTML += `
            <div class="flex justify-between items-center border-b border-white/5 pb-5 md:pb-6 gap-4">
                <div class="flex-1">
                    <p class="text-[11px] md:text-[10px] tracking-[0.12em] md:tracking-widest uppercase font-semibold text-white">${item.nombre}</p>
                    <p class="text-white/40 text-[11px] md:text-[10px] mt-1">Talle: ${item.talle}</p>
                    <p class="text-[#AF9662] text-[11px] md:text-[10px] mt-1 italic">$${item.precio.toLocaleString('es-AR')}</p>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="changeQty(${i}, -1)" class="w-8 h-8 md:w-7 md:h-7 border border-white/20 text-sm md:text-xs hover:bg-white hover:text-black transition rounded-full">-</button>
                    <span class="text-sm md:text-xs text-white min-w-[16px] text-center">${item.qty}</span>
                    <button onclick="changeQty(${i}, 1)" class="w-8 h-8 md:w-7 md:h-7 border border-white/20 text-sm md:text-xs hover:bg-white hover:text-black transition rounded-full">+</button>
                </div>
            </div>
        `;
    });

    document.getElementById('cart-total').innerText = `$${total.toLocaleString('es-AR')}`;
    document.getElementById('cart-count').innerText = carrito.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cart-footer').style.display = total > 0 ? 'block' : 'none';
}

function changeQty(i, delta) {
    carrito[i].qty += delta;

    if (carrito[i].qty < 1) {
        carrito.splice(i, 1);
    }

    saveCart();
    updateUI();
}

function showCheckout() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    toggleCart();
    document.getElementById('checkout-section').classList.remove('hidden');

    const summ = document.getElementById('checkout-summary');
    summ.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.qty;
        summ.innerHTML += `
            <div class="flex justify-between gap-4">
                <span>${item.qty}x ${item.nombre} (${item.talle})</span>
                <span>$${(item.precio * item.qty).toLocaleString('es-AR')}</span>
            </div>
        `;
    });

    document.getElementById('checkout-total-val').innerText = `$${total.toLocaleString('es-AR')}`;
}

function hideCheckout() {
    document.getElementById('checkout-section').classList.add('hidden');
}

function validarYMostrarPago() {
    const ids = ['chk-nombre', 'chk-email', 'chk-tel', 'chk-direccion', 'chk-provincia', 'chk-ciudad', 'chk-cp'];
    let ok = true;

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            el.style.borderBottomColor = 'red';
            ok = false;
        } else {
            el.style.borderBottomColor = 'rgba(255,255,255,0.12)';
        }
    });

    if (!ok) {
        alert('Por favor complete los datos obligatorios.');
        return;
    }

    const nombre = document.getElementById('chk-nombre').value;
    const email = document.getElementById('chk-email').value;
    const tel = document.getElementById('chk-tel').value;
    const provincia = document.getElementById('chk-provincia').value;
    const ciudad = document.getElementById('chk-ciudad').value;
    const direccion = document.getElementById('chk-direccion').value;
    const cp = document.getElementById('chk-cp').value;
    const nota = document.getElementById('chk-nota').value;

    let msg = `Hola Hilara, quiero finalizar este pedido:%0A%0A`;
    msg += `Cliente: ${nombre}%0A`;
    msg += `Email: ${email}%0A`;
    msg += `Tel: ${tel}%0A`;
    msg += `Provincia: ${provincia}%0A`;
    msg += `Ciudad: ${ciudad}%0A`;
    msg += `Dirección: ${direccion}%0A`;
    msg += `CP: ${cp}%0A`;
    if (nota.trim()) msg += `Notas: ${nota}%0A`;

    msg += `%0AProductos:%0A`;

    let total = 0;
    carrito.forEach(i => {
        const subtotal = i.precio * i.qty;
        total += subtotal;
        msg += `- ${i.qty}x ${i.nombre} (${i.talle}) - $${subtotal.toLocaleString('es-AR')}%0A`;
    });

    msg += `%0ATotal estimado: $${total.toLocaleString('es-AR')}`;

    window.open(`https://wa.me/5493875809594?text=${msg}`, '_blank');
}

function initReveal() {
    const elements = document.querySelectorAll('.reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
}

document.addEventListener('click', function (e) {
    const mobileMenu = document.getElementById('mobile-menu');
    const isMenuButton = e.target.closest('button') && e.target.closest('button').textContent.trim().includes('Menú');

    if (!mobileMenu.classList.contains('hidden') && !e.target.closest('#mobile-menu') && !isMenuButton) {
        mobileMenu.classList.add('hidden');
    }
});