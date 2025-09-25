function cartAdd(productId, qty){
  const productos = lsGet(LS_KEYS.productos, []);
  const p = productos.find(x=>x.id===productId); if(!p) return;
  const cart = lsGet(LS_KEYS.carrito, []);
  const existing = cart.find(c=>c.productId===productId);
  const newQty = (existing?.qty||0) + qty;
  const max = p.stock;
  if(newQty>max) return alert('No hay suficiente stock');
  if(existing){ existing.qty = newQty; }
  else { cart.push({productId, qty, priceAtAdd:p.precio}); }
  lsSet(LS_KEYS.carrito, cart);
  updateCartBadge();
  renderCartPanel();
}

function cartSet(productId, qty){
  qty = Number(qty||0);
  if(qty<=0) return cartRemove(productId);
  const productos = lsGet(LS_KEYS.productos, []);
  const p = productos.find(x=>x.id===productId); if(!p) return;
  if(qty>p.stock) return alert('Stock máximo: '+p.stock);
  const cart = lsGet(LS_KEYS.carrito, []);
  const item = cart.find(c=>c.productId===productId); if(!item) return;
  item.qty = qty;
  lsSet(LS_KEYS.carrito, cart);
  updateCartBadge(); renderCartPanel();
}

function cartInc(productId){
  const productos = lsGet(LS_KEYS.productos, []);
  const p = productos.find(x=>x.id===productId); if(!p) return;
  const cart = lsGet(LS_KEYS.carrito, []);
  const item = cart.find(c=>c.productId===productId); if(!item) return;
  if(item.qty+1>p.stock) return alert('Stock máximo alcanzado');
  item.qty += 1;
  lsSet(LS_KEYS.carrito, cart);
  updateCartBadge(); renderCartPanel();
}

function cartDec(productId){
  const cart = lsGet(LS_KEYS.carrito, []);
  const item = cart.find(c=>c.productId===productId); if(!item) return;
  item.qty -= 1;
  if(item.qty<=0){ return cartRemove(productId); }
  lsSet(LS_KEYS.carrito, cart);
  updateCartBadge(); renderCartPanel();
}

function cartRemove(productId){
  let cart = lsGet(LS_KEYS.carrito, []);
  cart = cart.filter(c=>c.productId!==productId);
  lsSet(LS_KEYS.carrito, cart);
  updateCartBadge(); renderCartPanel();
}

function cartClear(){
  lsSet(LS_KEYS.carrito, []);
  updateCartBadge(); renderCartPanel();
}

window.cartAdd = cartAdd;
window.cartInc = cartInc;
window.cartDec = cartDec;
window.cartRemove = cartRemove;
window.cartClear = cartClear;
window.cartSet = cartSet;
