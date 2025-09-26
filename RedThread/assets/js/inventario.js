document.addEventListener("DOMContentLoaded", () => {

  // ====== Regiones y comunas ======
  const REGIONES = {
    "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú"],
    "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
    "Región del Biobío": ["Concepción", "Talcahuano", "Chillán"],
  };

  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");

  if (regionSelect && comunaSelect) {
    regionSelect.innerHTML = '<option value="">-- Seleccione la región --</option>';
    Object.keys(REGIONES).forEach(r => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = r;
      regionSelect.appendChild(opt);
    });

    regionSelect.addEventListener("change", () => {
      comunaSelect.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
      (REGIONES[regionSelect.value] || []).forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        comunaSelect.appendChild(opt);
      });
    });
  }

  function validaRun(run) {
    // 8 dígitos + 1 DV (número o K)
    return /^[0-9]{8}[0-9K]$/.test(run);
  }
  // ====== Helpers ======
  function showErrors(list) {
    const box = document.getElementById("formMsg");
    if (!box) { alert(list.join("\n")); return; }
    box.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <strong>Corrige lo siguiente:</strong>
        <ul class="mb-0">${list.map(e => `<li>${e}</li>`).join("")}</ul>
      </div>`;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearMsg() {
    const box = document.getElementById("formMsg");
    if (box) box.innerHTML = "";
  }

  function markInvalid(el, invalid) {
    if (!el) return;
    el.classList.toggle("is-invalid", !!invalid);
  }

  // ====== Validación RUN ======
  const runInput = document.getElementById("run");

  runInput.addEventListener("input", () => {
    runInput.value = runInput.value.toUpperCase().replace(/[^0-9K]/g, "").slice(0, 9);
  });


  // ====== Validación de correo ======
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(gmail\.com|duoc\.cl|profesor\.duoc\.cl)$/i;

  // ====== Submit del formulario ======
  const form = document.getElementById("userForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearMsg();

      // limpiar marcas
      ["run", "nombre", "correo", "password", "confirmar", "telefono"].forEach(id => markInvalid(document.getElementById(id), false));
      markInvalid(regionSelect, false);
      markInvalid(comunaSelect, false);
      markInvalid(document.getElementById("rol"), false);

      const errores = [];

      // valores
      const run = runInput?.value.trim().toUpperCase() || "";
      const nombre = document.getElementById("nombre")?.value.trim() || "";
      const correo = document.getElementById("correo")?.value.trim() || "";
      const pwd = document.getElementById("password")?.value || "";
      const pwd2 = document.getElementById("confirmar")?.value || "";
      const telefono = document.getElementById("telefono")?.value.trim() || "";
      const regionVal = regionSelect?.value || "";
      const comunaVal = comunaSelect?.value || "";
      const rolVal = document.getElementById("rol")?.value || "";

      // RUN
      if (!validaRun(run)) {
        errores.push("RUN inválido. Debe tener exactamente 8 números + DV (número o K). Ej: 19011022K.");
        markInvalid(runInput, true);
      }

      // Nombre
      if (!nombre) {
        errores.push("El nombre es obligatorio.");
        markInvalid(document.getElementById("nombre"), true);
      } else if (nombre.length > 50) {
        errores.push("El nombre no puede exceder 50 caracteres.");
        markInvalid(document.getElementById("nombre"), true);
      }

      // Correo
      if (!correo) {
        errores.push("El correo es obligatorio.");
        markInvalid(document.getElementById("correo"), true);
      } else if (!EMAIL_REGEX.test(correo)) {
        errores.push("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        markInvalid(document.getElementById("correo"), true);
      }

      // ====== Validación de contraseñas ======
      if (pwd !== pwd2) {
        errores.push("Las contraseñas no coinciden.");
        markInvalid(document.getElementById("password"), true);
        markInvalid(document.getElementById("confirmar"), true);
      }

      // Región/Comuna/Rol
      if (!regionVal) { errores.push("Seleccione una región."); markInvalid(regionSelect, true); }
      if (!comunaVal) { errores.push("Seleccione una comuna."); markInvalid(comunaSelect, true); }
      if (!rolVal) { errores.push("Seleccione un rol."); markInvalid(document.getElementById("rol"), true); }

      // mostrar errores o éxito
      if (errores.length) {
        showErrors(errores);
        return;
      }

      const welcomeMsg = document.getElementById("welcomeMsg");
      const successMsg = document.getElementById("successMsg");
      if (welcomeMsg) welcomeMsg.classList.add("d-none");
      if (successMsg) {
        successMsg.classList.remove("d-none");
        successMsg.textContent = "✅ Usuario agregado correctamente";
      }


    });
  }
});
