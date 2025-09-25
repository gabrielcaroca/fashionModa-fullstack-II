function renderCheckout(){
  renderNavbar();

  const cont = document.getElementById('checkout');
  const cart = lsGet(LS_KEYS.carrito, []);
  const productos = lsGet(LS_KEYS.productos, []);

  if(!cart || cart.length===0){
    cont.innerHTML = `
      <div class="summary">
        <p class="muted">Tu carrito está vacío.</p>
        <a class="btn accent" href="productos.html">Ir a Productos</a>
      </div>`;
    renderFooter();
    return;
  }

  // resumen
  let subtotal = 0, itemsCount = 0;
  const itemsHtml = cart.map(ci=>{
    const p = productos.find(x=>x.id===ci.productId);
    const line = ci.qty * ci.priceAtAdd;
    subtotal += line; itemsCount += ci.qty;
    return `
      <div class="order-item">
        <img src="${p?.imagen||'assets/img/placeholder.png'}" alt="">
        <div>
          <div style="font-weight:700">${p?.nombre||'Producto'}</div>
          <div class="muted">${money(ci.priceAtAdd)} x ${ci.qty}</div>
        </div>
        <div style="font-weight:700">${money(line)}</div>
      </div>`;
  }).join('');

  const promo = subtotal>=50000 ? Math.round(subtotal*0.05) : 0;
  const envio = subtotal >= 40000 ? 0 : 3990;
  const total = subtotal - promo + envio;

  cont.innerHTML = `
    <div class="checkout-grid">
      <!-- Formulario -->
      <form id="payForm">
        <h3>Datos de envío</h3>
        <div class="row">
          <div class="form-field"><label>Nombre y Apellido</label><input class="input" name="nombre" required maxlength="100"></div>
          <div class="form-field"><label>Correo</label><input class="input" type="email" name="email" required maxlength="100" placeholder="tu@duoc.cl"></div>
        </div>
        <div class="row">
          <div class="form-field"><label>Dirección</label><input class="input" name="direccion" required maxlength="120"></div>
          <div class="form-field"><label>Comuna</label><input class="input" name="comuna" required maxlength="80"></div>
        </div>

        <h3 style="margin-top:16px">Pago</h3>
        <div class="form-field">
          <label>Método</label>
          <div style="display:flex;gap:16px;align-items:center">
            <label><input type="radio" name="metodo" value="tarjeta" checked> Tarjeta</label>
            <label><input type="radio" name="metodo" value="transferencia"> Transferencia</label>
          </div>
        </div>

        <div id="cardFields" class="row">
          <div class="form-field"><label>N° Tarjeta</label><input class="input" name="card" inputmode="numeric" pattern="\\d{16}" maxlength="16" placeholder="1111222233334444" required></div>
          <div class="form-field"><label>Vencimiento (MM/AA)</label><input class="input" name="exp" pattern="\\d{2}/\\d{2}" placeholder="09/27" required></div>
        </div>
        <div class="form-field"><label>CVV</label><input class="input" name="cvv" inputmode="numeric" pattern="\\d{3}" maxlength="3" placeholder="123" required style="max-width:140px"></div>

        <div id="msg" style="margin:8px 0"></div>
        <button class="btn accent">Pagar ${money(total)}</button>
        <a class="btn outline" href="productos.html" style="margin-left:8px">Seguir comprando</a>
      </form>

      <!-- Resumen -->
      <aside class="summary">
        <h3>Resumen (${itemsCount} ${itemsCount===1?'ítem':'ítems'})</h3>
        <div class="divider"></div>
        ${itemsHtml}
        <div class="divider"></div>
        <div class="sum-row"><span class="muted">Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="sum-row"><span class="muted">Ahorro promo</span><span>- ${money(promo)}</span></div>
        <div class="sum-row"><span class="muted">Envío</span><span>${envio===0?'Gratis':money(envio)}</span></div>
        <div class="sum-row" style="font-weight:800;font-size:18px"><span>Total</span><span>${money(total)}</span></div>
      </aside>
    </div>
  `;

  // listeners
  const form = document.getElementById('payForm');
  const msg = document.getElementById('msg');
  const radios = form.metodo;
  const cardFields = document.getElementById('cardFields');

  radios.forEach(r=>{
    r.addEventListener('change', ()=>{
      const isCard = form.metodo.value==='tarjeta';
      cardFields.style.display = isCard ? 'grid' : 'none';
      ['card','exp','cvv'].forEach(n=>{
        const el = form[n];
        if(!el) return;
        el.required = isCard;
      });
    });
  });

  form.addEventListener('submit',(e)=>{
    e.preventDefault(); msg.innerHTML='';

    const nombre = form.nombre.value.trim();
    const email  = form.email.value.trim();
    const dir    = form.direccion.value.trim();
    const comuna = form.comuna.value.trim();
    const metodo = form.metodo.value;

    if(!validateLen(nombre,1,100)) return msg.innerHTML = `<div class="alert error">Nombre requerido (máx 100).</div>`;
    if(!isEmailAllowed(email))     return msg.innerHTML = `<div class="alert error">Correo inválido o dominio no permitido.</div>`;
    if(!validateLen(dir,5,120))    return msg.innerHTML = `<div class="alert error">Dirección inválida.</div>`;
    if(!validateLen(comuna,2,80))  return msg.innerHTML = `<div class="alert error">Comuna inválida.</div>`;

    if(metodo==='tarjeta'){
      const card = (form.card.value||'').replace(/\s+/g,'');
      const exp  = form.exp.value||'';
      const cvv  = form.cvv.value||'';
      if(!/^\d{16}$/.test(card))   return msg.innerHTML = `<div class="alert error">Tarjeta inválida (16 dígitos).</div>`;
      if(!/^\d{2}\/\d{2}$/.test(exp)) return msg.innerHTML = `<div class="alert error">Vencimiento inválido (MM/AA).</div>`;
      if(!/^\d{3}$/.test(cvv))     return msg.innerHTML = `<div class="alert error">CVV inválido (3 dígitos).</div>`;
    }

    // Cuando el pago de ok
    const orderId = 'RT-' + Date.now().toString().slice(-6);
    const lastOrder = {
      id: orderId,
      nombre, email, dir, comuna, metodo,
      items: cart, subtotal, promo, envio, total,
      fecha: new Date().toISOString()
    };
    lsSet('fm_last_order', lastOrder);
    lsSet(LS_KEYS.carrito, []); // Para vaciar el carrito
    updateCartBadge();

    cont.innerHTML = `
      <div class="summary" style="text-align:center">
        <h3>¡Gracias por tu compra!</h3>
        <p>Orden <strong>${orderId}</strong> confirmada.</p>
        <p>Enviaremos el detalle a <strong>${email}</strong>.</p>
        <p class="muted">Total pagado: ${money(total)}</p>
        <div class="divider"></div>
        <a class="btn accent" href="productos.html">Seguir comprando</a>
        <a class="btn outline" href="index.html" style="margin-left:8px">Ir al inicio</a>
      </div>
    `;
    renderFooter();
  });

  renderFooter();
}

document.addEventListener('DOMContentLoaded', renderCheckout);
