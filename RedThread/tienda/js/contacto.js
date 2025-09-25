document.addEventListener('DOMContentLoaded', ()=>{
  renderNavbar();
  const f = document.getElementById('form-contacto');
  const msg = document.getElementById('msg');
  f.addEventListener('submit', (e)=>{
    e.preventDefault(); msg.innerHTML='';
    const nombre = f.nombre.value.trim();
    const email = f.email.value.trim();
    const comentario = f.comentario.value.trim();
    if(!validateLen(nombre,1,100)) return msg.innerHTML = `<div class="alert error">Nombre requerido (máx 100).</div>`;
    if(!isEmailAllowed(email)) return msg.innerHTML = `<div class="alert error">Correo inválido o dominio no permitido.</div>`;
    if(!validateLen(comentario,1,500)) return msg.innerHTML = `<div class="alert error">Comentario requerido (máx 500).</div>`;
    msg.innerHTML = `<div class="alert ok">Mensaje enviado correctamente.</div>`;
    f.reset();
  });
  renderFooter();
});
