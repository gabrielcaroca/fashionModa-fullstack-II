// ====== Regiones y comunas (puedes ampliar estas listas) ======
const REGIONES = {
  "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú"],
  "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Región del Biobío": ["Concepción", "Talcahuano", "Chillán"],
};

// ====== Carga dinámica de región/comuna ======
const regionSelect = document.getElementById("region");
const comunaSelect = document.getElementById("comuna");

if (regionSelect && comunaSelect) {
  // Cargar regiones
  Object.keys(REGIONES).forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    regionSelect.appendChild(opt);
  });

  // Cambiar comunas al elegir región
  regionSelect.addEventListener("change", () => {
    comunaSelect.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
    const comunas = REGIONES[regionSelect.value] || [];
    comunas.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      comunaSelect.appendChild(opt);
    });
  });
}

// ====== Helpers de mensajes ======
function showErrors(list) {
  const box = document.getElementById("formMsg");
  if (!box) return alert(list.join("\n"));
  box.innerHTML = `
    <div class="alert alert-danger" role="alert">
      <strong>Corrige lo siguiente:</strong>
      <ul class="mb-0">${list.map((e) => `<li>${e}</li>`).join("")}</ul>
    </div>`;
}
function clearMsg() {
  const box = document.getElementById("formMsg");
  if (box) box.innerHTML = "";
}

// ====== Validación RUN (sin puntos ni guion, con DV) ======
function normalizaRun(str) {
  return (str || "").toUpperCase().replace(/[^0-9K]/g, "");
}
function dvRut(body) {
  let sum = 0, mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const rest = 11 - (sum % 11);
  return rest === 11 ? "0" : rest === 10 ? "K" : String(rest);
}
function validaRun(run) {
  const r = normalizaRun(run);
  if (r.length < 7 || r.length > 9) return false;
  if (!/^[0-9K]+$/.test(r)) return false;
  const cuerpo = r.slice(0, -1);
  const dv = r.slice(-1);
  return dvRut(cuerpo) === dv;
}

// ====== Validación de correo (dominios permitidos) ======
const EMAIL_REGEX = /^[\w.%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

// ====== Submit del formulario ======
document.getElementById("userForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  clearMsg();

  const errores = [];

  const run = document.getElementById("run").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const pwd = document.getElementById("pwd").value;
  const pwd2 = document.getElementById("pwd2").value;
  const telefono = document.getElementById("telefono").value.trim();
  const region = regionSelect?.value || "";
  const comuna = comunaSelect?.value || "";
  const rol = (document.getElementById("rol")?.value || "").toLowerCase();

  // RUN
  if (!run) {
    errores.push("El RUN es requerido.");
  } else if (!validaRun(run)) {
    errores.push("RUN inválido. Ingrésalo sin puntos ni guion (ej: 19011022K).");
  }

  // Nombre
  if (!nombre) errores.push("El nombre es requerido.");
  else if (nombre.length > 50) errores.push("El nombre no puede exceder 50 caracteres.");

  // Correo
  if (!correo) errores.push("El correo es requerido.");
  else if (correo.length > 100) errores.push("El correo no puede exceder 100 caracteres.");
  else if (!EMAIL_REGEX.test(correo)) {
    errores.push("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.");
  }

  // Password
  if (!pwd) errores.push("La contraseña es requerida.");
  if (!pwd2) errores.push("Debe confirmar la contraseña.");
  if (pwd && pwd2 && pwd !== pwd2) errores.push("Las contraseñas no coinciden.");

  // Teléfono (opcional) — si lo escribe, que sea solo dígitos razonables
  if (telefono && !/^\d{7,12}$/.test(telefono)) {
    errores.push("El teléfono debe tener entre 7 y 12 dígitos (solo números).");
  }

  // Región / Comuna / Rol
  if (!region) errores.push("Seleccione una región.");
  if (!comuna) errores.push("Seleccione una comuna.");
  if (!rol) errores.push("Seleccione un rol.");

  if (errores.length) {
    showErrors(errores);
    return;
  }

  // Éxito
  const box = document.getElementById("formMsg");
  if (box) {
    box.innerHTML = `<div class="alert alert-success" role="alert">
      Usuario registrado correctamente ✅
    </div>`;
  } else {
    alert("Usuario registrado correctamente ✅");
  }

  // Aquí podrías hacer fetch/POST con los datos si corresponde…
  // this.reset();
});
