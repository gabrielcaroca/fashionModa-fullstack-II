const EMAIL_ALLOWED = ['@duoc.cl','@profesor.duoc.cl','@gmail.com'];

function isEmailAllowed(email=''){
  if(!email || email.length>100) return false;
  return EMAIL_ALLOWED.some(dom => email.endsWith(dom));
}
function validatePassword(pw=''){ return typeof pw==='string' && pw.length>=4 && pw.length<=10; }
function validateLen(s='', min=1, max=100){ return typeof s==='string' && s.trim().length>=min && s.trim().length<=max; }

window.isEmailAllowed = isEmailAllowed;
window.validatePassword = validatePassword;
window.validateLen = validateLen;
