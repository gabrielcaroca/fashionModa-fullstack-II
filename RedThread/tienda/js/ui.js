// Mostrar el formato CLP
function money(n){ return new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n||0); }

function renderNavbar(){
  const auth = lsGet(LS_KEYS.auth);
  const isLogged = !!auth;
  const userLabel = isLogged ? `Mi cuenta (${auth.email})` : 'Login';
  const userHref = isLogged ? 'nosotros.html' : 'login.html';

  const html = `
    <div class="navbar">
      <a class="brand" href="index.html">
        <img src="assets/img/redthread-logo.svg" alt="R"> RedThread
      </a>
      <a href="productos.html">Productos</a>
      <a href="blogs.html">Blogs</a>
      <a href="nosotros.html">Nosotros</a>
      <a href="contacto.html">Contacto</a>
      <div class="nav-right">
        <a id="cartToggle" href="#" title="Carrito">🛒 <span id="cartBadge" class="badge">0</span></a>
        <a href="${userHref}">${userLabel}</a>
        ${isLogged ? `<a href="#" id="logoutLink">Cerrar sesión</a>`:''}
      </div>
    </div>
    <div id="cartPanel" class="cart-panel"></div>
  `;
  document.body.insertAdjacentHTML('afterbegin', html);

  document.getElementById('cartToggle').addEventListener('click', (e)=>{
    e.preventDefault(); toggleCartPanel();
  });
  if(isLogged){
    document.getElementById('logoutLink')?.addEventListener('click', (e)=>{
      e.preventDefault(); logout(); location.href='index.html';
    });
  }
  updateCartBadge();
  renderCartPanel();
}

function renderFooter(){
  const html = `
    <div class="footer">
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div><strong>RedThread</strong>
            <p>Toda tu ropa urbana/fit accesible. .</p>
          </div>
          <div><strong>Links</strong>
            <p><a href="productos.html">Productos</a> · <a href="blogs.html">Blogs</a> · <a href="contacto.html">Contacto</a></p>
          </div>
        </div>
        <p style="margin-top:8px;opacity:.7">© ${new Date().getFullYear()} RedThread</p>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function updateCartBadge(){
  const cart = lsGet(LS_KEYS.carrito, []);
  const count = cart.reduce((a,it)=>a+it.qty,0);
  const el = document.getElementById('cartBadge'); if(el) el.textContent = count;
}

function renderCartPanel(){
  const panel = document.getElementById('cartPanel'); if(!panel) return;
  const cart = lsGet(LS_KEYS.carrito, []);
  const productos = lsGet(LS_KEYS.productos, []);
  let total = 0, itemsCount = 0;

  const items = cart.map(ci=>{
    const p = productos.find(x=>x.id===ci.productId);
    const line = (ci.qty * ci.priceAtAdd);
    total += line; itemsCount += ci.qty;
    return `
      <div class="cart-item">
        <img src="${p?.imagen||'assets/img/placeholder.png'}" alt="">
        <div>
          <div style="font-weight:700">${p?.nombre||'Producto'}</div>
          <div class="price">${money(ci.priceAtAdd)} x ${ci.qty} = ${money(line)}</div>
          <div class="qty">
            <button onclick="cartDec(${ci.productId})">-</button>
            <input type="number" min="1" value="${ci.qty}" style="width:52px;padding:6px;border:1px solid #ddd;border-radius:8px" oninput="cartSet(${ci.productId}, this.value)">
            <button onclick="cartInc(${ci.productId})">+</button>
            <button style="margin-left:auto" onclick="cartRemove(${ci.productId})">🗑️</button>
          </div>
        </div>
      </div>`;
  }).join('') || `<p style="opacity:.7">Tu carrito está vacío.</p>`;

  const promo = total>=50000 ? Math.round(total*0.05) : 0;
  const totalFinal = total - promo;

  panel.innerHTML = `
    <div class="cart-header">
      <strong>Carrito (${itemsCount} ${itemsCount===1?'ítem':'ítems'})</strong>
      <div style="display:flex;gap:8px">
        <a class="btn outline" href="productos.html">Seguir comprando</a>
        <button class="btn outline" onclick="toggleCartPanel()">Cerrar</button>
      </div>
    </div>
    ${items}
    <div style="margin-top:8px;border-top:1px dashed #eee;padding-top:8px">
      <div style="display:flex;justify-content:space-between"><span>Subtotal</span><span>${money(total)}</span></div>
      <div style="display:flex;justify-content:space-between;color:${promo? '#16a34a':'#6b7280'}"><span>Ahorro promo</span><span>- ${money(promo)}</span></div>
      <div class="cart-total"><span>Total</span><span>${money(totalFinal)}</span></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="btn outline" onclick="cartClear()">Vaciar</button>
      ${itemsCount ? `<a class="btn accent" href="checkout.html">Pagar</a>` : `<button class="btn accent" disabled>Pagar</button>`}
    </div>
  `;
}


function toggleCartPanel(){
  const panel = document.getElementById('cartPanel');
  if(!panel) return;
  const visible = panel.style.display==='block';
  panel.style.display = visible ? 'none' : 'block';
}

window.updateCartBadge = updateCartBadge;
window.renderCartPanel = renderCartPanel;
window.toggleCartPanel = toggleCartPanel;
window.money = money;
