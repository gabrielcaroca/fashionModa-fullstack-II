// --- Carrito sencillo con LocalStorage ---
const CART_KEY = 'rt_cart_v1';

function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function cartCount(cart){ return Object.values(cart).reduce((acc, it) => acc + it.qty, 0); }
function formatCLP(n){ return n.toLocaleString('es-CL'); }

function updateBadges(){
  const count = cartCount(getCart());
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = count);
}

function wireAddToCart(){
  document.querySelectorAll('.add-to-cart').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const id    = btn.dataset.id;
      const name  = btn.dataset.name;
      const price = parseInt(btn.dataset.price,10) || 0;

      const cart = getCart();
      if(!cart[id]) cart[id] = { id, name, price, qty: 0 };
      cart[id].qty += 1;
      saveCart(cart);
      updateBadges();
      btn.blur();
    });
  });
}

function renderCartPage(){
  const tbody = document.getElementById('cart-body');
  const totalEl = document.getElementById('cart-total');
  if(!tbody || !totalEl) return;

  const cart = getCart();
  const items = Object.values(cart);

  tbody.innerHTML = '';
  let total = 0;

  if(items.length === 0){
    tbody.innerHTML = `<tr><td colspan="5">No hay productos agregados.</td></tr>`;
  } else {
    items.forEach(it=>{
      const sub = it.price * it.qty;
      total += sub;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${it.name}</td>
        <td>$${formatCLP(it.price)}</td>
        <td>${it.qty}</td>
        <td>$${formatCLP(sub)}</td>
        <td><button class="btn-secundario remove-item" data-id="${it.id}">Quitar</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  totalEl.textContent = '$' + formatCLP(total);

  tbody.querySelectorAll('.remove-item').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.id;
      const cart = getCart();
      if(cart[id]){
        cart[id].qty -= 1;
        if(cart[id].qty <= 0) delete cart[id];
        saveCart(cart);
        updateBadges();
        renderCartPage();
      }
    });
  });

  const clearBtn = document.getElementById('cart-clear');
  if(clearBtn){
    clearBtn.onclick = ()=>{
      localStorage.removeItem(CART_KEY);
      updateBadges();
      renderCartPage();
    };
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateBadges();
  wireAddToCart();
  renderCartPage();
});
// ---- Pago: muestra 'Pago OK' y vacía el carrito ----
(function(){
  function attachPay(){
    var pay = document.getElementById('cart-pay');
    if(!pay) return;
    pay.addEventListener('click', function(e){
      e.preventDefault();
      var cart = getCart && getCart() || {};
      if (Object.keys(cart).length === 0) {
        alert('Tu carrito está vacío.');
        return;
      }
      // Vaciar y confirmar
      localStorage.removeItem(CART_KEY);
      updateBadges && updateBadges();
      if (typeof renderCartPage === 'function') { renderCartPage(); }
      alert('Pago OK');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachPay);
  } else {
    attachPay();
  }
})();