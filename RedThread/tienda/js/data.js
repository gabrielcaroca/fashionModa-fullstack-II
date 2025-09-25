// llaves locales
const LS_KEYS = {
  productos: 'fm_productos',
  categorias: 'fm_categorias',
  carrito: 'fm_carrito',
  usuarios: 'fm_usuarios',
  auth: 'fm_auth'
};

function lsGet(key, fallback){ try{
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : (fallback ?? null);
}catch{ return fallback ?? null; } }
function lsSet(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

// generar imagen para los productos
function makeSvgData(name, subtitle){
  const W=800,H=600;
  const palette = ["#D32F2F","#212121","#9E9E9E","#444","#B71C1C","#616161"];
  const bg = palette[(name?.length||0)%palette.length];
  const esc = s => String(s||'').replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const svg =
`<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'>
  <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
    <stop offset='0' stop-color='${bg}'/><stop offset='1' stop-color='#111'/></linearGradient></defs>
  <rect width='100%' height='100%' fill='url(#g)'/>
  <rect x='36' y='36' width='728' height='528' rx='24' fill='rgba(255,255,255,0.06)' stroke='rgba(255,255,255,0.15)'/>
  <text x='56' y='320' font-family='system-ui,Segoe UI,Roboto' font-weight='800' font-size='48' fill='#fff'>${esc(name)}</text>
  <text x='56' y='370' font-family='system-ui,Segoe UI,Roboto' font-size='20' fill='rgba(255,255,255,0.85)'>${esc(subtitle||'RedThread · Urban/Modern')}</text>
</svg>`;
  return "data:image/svg+xml;utf8,"+encodeURIComponent(svg);
}

// Catalogo
const DEFAULT_CATEGORIES = [
  {id:1, nombre:'Poleras'}, {id:2, nombre:'Polerones'},
  {id:3, nombre:'Pantalones'}, {id:4, nombre:'Accesorios'}
];

const CATALOG = [
  {id:101, nombre:'Polera Oversize Negra',   desc:'Algodón peinado 240gsm, cuello reforzado, fit relajado.', precio:12990, stock:18, categoriaId:1},
  {id:102, nombre:'Polerón Zip Gris',        desc:'Polar cepillado interior, cierre YKK, bolsillos laterales.', precio:19990, stock: 9, categoriaId:2},
  {id:103, nombre:'Jogger Cargo Arena',      desc:'Drill 280gsm, pretina elástica, 6 bolsillos funcionales.',   precio:22990, stock: 7, categoriaId:3},
  {id:104, nombre:'Gorro Beanie',            desc:'Acrílico hipoalergénico, tejido elástico, unisex.',          precio: 8990, stock:25, categoriaId:4},
  {id:105, nombre:'Polera Boxy Blanca',      desc:'Corte boxy, hombro caído, algodón 220gsm.',                  precio:12990, stock:20, categoriaId:1},
  {id:106, nombre:'Polerón Capucha Rojo',    desc:'French Terry 320gsm, capucha forrada.',                      precio:21990, stock: 8, categoriaId:2},
  {id:107, nombre:'Jean Slim Indigo',        desc:'Denim 12oz con 2% elastano, lavado medio.',                  precio:25990, stock:10, categoriaId:3},
  {id:108, nombre:'Cinturón Canvas Negro',   desc:'Tejido resistente con hebilla metálica mate.',               precio: 6990, stock:30, categoriaId:4},
  {id:109, nombre:'Polera Gráfica RedThread',desc:'DTF suave al tacto, obra “Urban Line”.',                     precio:14990, stock:14, categoriaId:1},
  {id:110, nombre:'Hoodie Oversize Negro',   desc:'400gsm premium, capucha amplia.',                            precio:27990, stock: 6, categoriaId:2},
  {id:111, nombre:'Cargo Tech Gris',         desc:'Ripstop liviano repelente al agua.',                         precio:28990, stock: 5, categoriaId:3},
  {id:112, nombre:'Gorra 6 paneles',         desc:'Algodón, ajuste metálico, logo tono a tono.',               precio: 9990, stock:18, categoriaId:4},
].map(p=>({...p, stockCritico:3}));

// ====== merge "no destructivo": agrega los que faltan y completa imágenes ======
(function ensureCatalogAndCategories(){
  const current = lsGet(LS_KEYS.productos, []);
  const byId = new Map((current||[]).map(p=>[p.id, p]));
  let changed = false;

  for(const item of CATALOG){
    if(!byId.has(item.id)){ 
      byId.set(item.id, {...item, imagen: makeSvgData(item.nombre, item.desc)});
      changed = true;
    }else{
      const existing = byId.get(item.id);
      if(!existing.imagen) { existing.imagen = makeSvgData(existing.nombre||item.nombre, existing.desc||item.desc); changed = true; }
      if(existing.desc==null) { existing.desc = item.desc; changed = true; }
      if(existing.precio==null) { existing.precio = item.precio; changed = true; }
      if(existing.categoriaId==null){ existing.categoriaId = item.categoriaId; changed = true; }
    }
  }
  if(changed) lsSet(LS_KEYS.productos, Array.from(byId.values()));

  // categorias
  const cats = lsGet(LS_KEYS.categorias);
  if(!Array.isArray(cats) || cats.length===0){
    lsSet(LS_KEYS.categorias, DEFAULT_CATEGORIES);
  }

  // estrucutra base
  if(!lsGet(LS_KEYS.usuarios)) lsSet(LS_KEYS.usuarios, []);
  if(!lsGet(LS_KEYS.carrito))  lsSet(LS_KEYS.carrito,  []);
})();
