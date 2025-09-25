function currentUser(){ return lsGet(LS_KEYS.auth,null); }
function login(email, password){
  // Usuarios o autoguardado
  if(!isEmailAllowed(email) || !validatePassword(password)) return false;
  const usuarios = lsGet(LS_KEYS.usuarios, []);
  const exists = usuarios.find(u=>u.email===email && u.password===password);
  if(!exists) return false;
  lsSet(LS_KEYS.auth, {email: exists.email, rol: 'CLIENTE'});
  return true;
}
function logout(){ localStorage.removeItem(LS_KEYS.auth); }

window.currentUser = currentUser;
window.login = login;
window.logout = logout;
