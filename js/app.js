const MP_PUBLIC_KEY = 'TU_PUBLIC_KEY_AQUI'; // Reemplazar

const productos = [
    { id: 1, cat: 'ruana', nombre: "Ruana Alpaca Gold", precio: 185000, desc: "Lana de alpaca seleccionada con hilos de oro. Tejido artesanal de lujo.", imgs: ["https://images.unsplash.com/photo-1601924921557-45e6ecd080ee?w=800", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800"] },
    { id: 2, cat: 'ruana', nombre: "Ruana Mistral", precio: 195000, desc: "Fibras pesadas y naturales para climas extremos.", imgs: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", "https://images.unsplash.com/photo-1601924921557-45e6ecd080ee?w=800", "https://images.unsplash.com/photo-1544441893-675973e31985?w=800"] },
    { id: 6, cat: 'pashmina', nombre: "Pashmina Seda Real", precio: 85000, desc: "Seda 100% natural, fluidez y caída incomparable.", imgs: ["https://images.unsplash.com/photo-1456889419948-46c84916da65?w=800", "https://images.unsplash.com/photo-1583209814613-5114a9a23bc2?w=800", "https://images.unsplash.com/photo-1520633832028-3d2372fbc622?w=800"] }
    // Continuar replicando para completar los 10 items...
];

let carrito = [];
let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => { renderStore(); });

function renderStore() {
    const contR = document.getElementById('catalog-ruanas');
    const contP = document.getElementById('catalog-pashminas');
    productos.forEach(p => {
        const html = `
            <div class="product-card group relative overflow-hidden h-[550px] cursor-pointer" onclick="openModal(${p.id})">
                <img src="${p.imgs[0]}" class="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition duration-1000 group-hover:scale-110">
                <div class="details-glass absolute bottom-4 left-4 right-4 p-8 text-center backdrop-blur-md border border-white/10 bg-black/60">
                    <h3 class="font-serif text-white text-xl italic mb-2">${p.nombre}</h3>
                    <p class="text-[#AF9662] font-semibold tracking-widest text-sm">$${p.precio.toLocaleString()}</p>
                </div>
            </div>`;
        p.cat === 'ruana' ? contR.innerHTML += html : contP.innerHTML += html;
    });
}

function openModal(id) {
    currentProduct = productos.find(x => x.id === id);
    document.getElementById('modal-title').innerText = currentProduct.nombre;
    document.getElementById('modal-price').innerText = `$${currentProduct.precio.toLocaleString()}`;
    document.getElementById('modal-desc').innerText = currentProduct.desc;
    document.getElementById('modal-img-main').src = currentProduct.imgs[0];
    for(let i=0; i<3; i++) document.getElementById(`thumb-${i}`).src = currentProduct.imgs[i] || currentProduct.imgs[0];
    document.getElementById('product-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function changeModalImg(i) { document.getElementById('modal-img-main').src = currentProduct.imgs[i]; }
function closeModal() { document.getElementById('product-modal').classList.add('hidden'); document.body.style.overflow = 'auto'; }
function toggleCart() { document.getElementById('side-cart').classList.toggle('translate-x-full'); }

function addToCartFromModal() {
    const talle = document.getElementById('modal-talle').value;
    const qty = parseInt(document.getElementById('modal-qty').value);
    const item = carrito.find(x => x.id === currentProduct.id && x.talle === talle);
    item ? item.qty += qty : carrito.push({...currentProduct, talle, qty});
    updateUI(); closeModal(); toggleCart();
}

function updateUI() {
    const cont = document.getElementById('cart-items'); cont.innerHTML = ''; let total = 0;
    carrito.forEach((item, i) => {
        total += item.precio * item.qty;
        cont.innerHTML += `
            <div class="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <p class="text-[10px] tracking-widest uppercase font-semibold text-white">${item.nombre} (${item.talle})</p>
                    <p class="text-[#AF9662] text-[10px] mt-1 italic">$${item.precio.toLocaleString()}</p>
                </div>
                <div class="flex items-center space-x-4">
                    <button onclick="changeQty(${i}, -1)" class="w-7 h-7 border border-white/20 text-xs hover:bg-white hover:text-black transition">-</button>
                    <span class="text-xs text-white">${item.qty}</span>
                    <button onclick="changeQty(${i}, 1)" class="w-7 h-7 border border-white/20 text-xs hover:bg-white hover:text-black transition">+</button>
                </div>
            </div>`;
    });
    document.getElementById('cart-total').innerText = `$${total.toLocaleString()}`;
    document.getElementById('cart-count').innerText = carrito.reduce((s,i)=>s+i.qty, 0);
    document.getElementById('cart-footer').style.display = total > 0 ? 'block' : 'none';
}

function changeQty(i, d) { carrito[i].qty += d; if(carrito[i].qty < 1) carrito.splice(i, 1); updateUI(); }

function showCheckout() {
    toggleCart(); document.getElementById('checkout-section').classList.remove('hidden');
    const summ = document.getElementById('checkout-summary'); summ.innerHTML = ''; let total = 0;
    carrito.forEach(item => { 
        total += (item.precio * item.qty); 
        summ.innerHTML += `<div class="flex justify-between"><span>${item.qty}x ${item.nombre} (${item.talle})</span><span>$${(item.precio * item.qty).toLocaleString()}</span></div>`; 
    });
    document.getElementById('checkout-total-val').innerText = `$${total.toLocaleString()}`;
}

function hideCheckout() { document.getElementById('checkout-section').classList.add('hidden'); }

function validarYMostrarPago() {
    const ids = ['chk-nombre', 'chk-email', 'chk-tel', 'chk-direccion', 'chk-provincia', 'chk-ciudad', 'chk-cp'];
    let ok = true; 
    ids.forEach(id => { 
        const el = document.getElementById(id);
        if(!el.value) { el.style.borderColor = "red"; ok = false; } 
        else { el.style.borderColor = "rgba(255, 255, 255, 0.1)"; }
    });
    if(!ok) return alert("Por favor complete los datos obligatorios.");

    document.getElementById('btn-validar').classList.add('hidden');
    document.getElementById('walletBrick_container').classList.remove('hidden');
    initMP(carrito.reduce((s,i)=> s + (i.precio * i.qty), 0));
}

async function initMP(total) {
    const mp = new MercadoPago(MP_PUBLIC_KEY, { locale: 'es-AR' });
    const bricksBuilder = mp.bricks();
    const nombre = document.getElementById('chk-nombre').value;
    const tel = document.getElementById('chk-tel').value;
    const direccion = document.getElementById('chk-direccion').value;

    bricksBuilder.create("wallet", "walletBrick_container", {
        initialization: {
            preferenceId: async () => {
                const res = await fetch('/.netlify/functions/create_preference', {
                    method: 'POST',
                    body: JSON.stringify({ price: total, title: "HILARA - Pedido", metadata: { nombre, tel, direccion } })
                });
                const data = await res.json();
                return data.id;
            },
        },
        callbacks: {
            onSubmit: () => {
                let msg = `*NUEVO PEDIDO HILARA*\n--------------------------\n*Cliente:* ${nombre}\n*Tel:* ${tel}\n*Dirección:* ${direccion}\n*Total:* $${total.toLocaleString()}\n\n*Items:*\n`;
                carrito.forEach(i => msg += `- ${i.qty}x ${i.nombre} (${i.talle})\n`);
                sessionStorage.setItem('pendingWA', `https://wa.me/5493875809594?text=${encodeURIComponent(msg)}`);
            }
        }
    });
}