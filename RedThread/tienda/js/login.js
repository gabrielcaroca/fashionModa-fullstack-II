document.addEventListener('DOMContentLoaded', ()=>{
  renderNavbar();
  const form = document.getElementById('form-login');
  const msg = document.getElementById('msg');
  form.addEventListener('submit', (e)=>{
    e.preventDefault(); msg.innerHTML='';
    const email = form.email.value.trim();
    const pw = form.password.value;
    if(login(email, pw)){
      msg.innerHTML = `<div class="alert ok">Ingreso correcto. Redirigiendo…</div>`;
      setTimeout(()=>location.href='index.html', 600);
    }else{
      msg.innerHTML = `<div class="alert error">Credenciales inválidas.</div>`;
    }
  });
  renderFooter();
});
