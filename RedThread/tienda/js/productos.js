function getCategoriesSafe(){
  let cats = lsGet(LS_KEYS.categorias, []);
  const fallback = {1:'Poleras',2:'Polerones',3:'Pantalones',4:'Accesorios'};
  if(!Array.isArray(cats) || cats.length===0){
    const prods = lsGet(LS_KEYS.productos, []);
    const set = new Set(prods.map(p=>p.categoriaId).filter(Boolean));
    cats = Array.from(set).sort().map(id=>({id, nombre: fallback[id] || ('Categoría '+id)}));
    lsSet(LS_KEYS.categorias, cats);
  }
  return cats;
}

function renderFiltros(){
  const wrap = document.getElementById('filters');
  const cats = getCategoriesSafe();
  const options = ['<option value="">Todas</option>', ...cats.map(c=>`<option value="${c.id}">${c.nombre}</option>`)].join('');
  wrap.innerHTML = `
    <div class="row">
      <div><label>Búsqueda</label><input id="q" class="input" placeholder="Buscar por nombre..."></div>
      <div><label>Categoría</label><select id="cat" class="input">${options}</select></div>
    </div>
  `;
  document.getElementById('q').addEventListener('input', renderProductos);
  document.getElementById('cat').addEventListener('change', renderProductos);
}

function renderProductos(){
  const q = (document.getElementById('q')?.value||'').toLowerCase();
  const cat = (document.getElementById('cat')?.value||'');
  const cont = document.getElementById('grid');
  const prods = lsGet(LS_KEYS.productos, []);

  const filtered = prods.filter(p=>{
    const okName = (p.nombre||'').toLowerCase().includes(q);
    const okCat = !cat || String(p.categoriaId)===String(cat);
    return okName && okCat;
  });

  cont.innerHTML = filtered.map(p=>`
    <div class="card" style="animation:fadeIn .25s ease both">
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" referrerpolicy="no-referrer"
           onerror="this.onerror=null;this.src='assets/img/placeholder.png'">
      <div class="body">
        <div style="font-weight:700">${p.nombre}</div>
        <div class="price">${money(p.precio)}</div>
        <p style="opacity:.8;min-height:40px">${(p.desc||'').slice(0,68)}${(p.desc||'').length>68?'…':''}</p>
        <div style="display:flex;gap:8px;margin-top:8px">
          <a class="btn outline" href="producto.html?id=${p.id}">Ver</a>
          <button class="btn accent" onclick="cartAdd(${p.id},1)">Añadir</button>
        </div>
      </div>
    </div>
  `).join('') || `<p>No se encontraron productos.</p>`;
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderNavbar();
  renderFiltros();
  renderProductos();
  renderFooter();
});
