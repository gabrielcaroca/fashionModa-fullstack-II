document.addEventListener('DOMContentLoaded', ()=>{
  renderNavbar();
  const form = document.getElementById('form-reg');
  const msg = document.getElementById('msg');
  form.addEventListener('submit', (e)=>{
    e.preventDefault(); msg.innerHTML='';
    const email = form.email.value.trim();
    const pw = form.password.value;
    const nombre = form.nombre.value.trim();
    if(!isEmailAllowed(email)) return msg.innerHTML = `<div class="alert error">Correo inválido o dominio no permitido.</div>`;
    if(!validatePassword(pw)) return msg.innerHTML = `<div class="alert error">La contraseña debe tener entre 4 y 10 caracteres.</div>`;
    if(!validateLen(nombre,1,100)) return msg.innerHTML = `<div class="alert error">Nombre requerido (máx 100).</div>`;
    const usuarios = lsGet(LS_KEYS.usuarios, []);
    if(usuarios.some(u=>u.email===email)) return msg.innerHTML = `<div class="alert error">El correo ya está registrado.</div>`;
    usuarios.push({email, password: pw, nombre});
    lsSet(LS_KEYS.usuarios, usuarios);
    msg.innerHTML = `<div class="alert ok">Registro exitoso. Ahora puedes iniciar sesión.</div>`;
    form.reset();
  });
  renderFooter();
});
