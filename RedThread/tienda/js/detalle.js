function getParam(name){
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

function renderDetalle(){
  const id = Number(new URL(location.href).searchParams.get('id'));
  const p = lsGet(LS_KEYS.productos, []).find(x=>x.id===id);
  const cont = document.getElementById('detalle');
  if(!p){ cont.innerHTML = '<p class="alert error">Producto no encontrado.</p>'; return; }
  cont.innerHTML = `
    <div class="row">
      <img src="${p.imagen||'assets/img/placeholder.png'}" alt="" style="width:100%;max-height:420px;object-fit:cover;border-radius:12px;background:#f5f5f5">
      <div>
        <h2 style="margin-top:0">${p.nombre}</h2>
        <div class="price" style="font-size:22px">${money(p.precio)}</div>
        <p style="opacity:.85">${p.desc||''}</p>
        <ul style="opacity:.85;line-height:1.6">
          <li>Envíos a todo Chile.</li>
          <li>Cambio dentro de 10 días por talla.</li>
          <li>Soporte por WhatsApp de 10:00 a 18:00.</li>
        </ul>
        <p style="${p.stock<=p.stockCritico?'color:#b91c1c;font-weight:700':''}">Stock disponible: ${p.stock}</p>
        <div style="display:flex;gap:8px">
          <button class="btn accent" onclick="cartAdd(${p.id},1)">Añadir al carrito</button>
          <a class="btn outline" href="productos.html">Volver</a>
        </div>
      </div>
    </div>
  `;
}
document.addEventListener('DOMContentLoaded', ()=>{ renderNavbar(); renderDetalle(); renderFooter(); });

