// ===============================
// 🔹 Filtro de estado (Employees)
// ===============================
const filtroSelect = document.getElementById("filtroEstado");
if (filtroSelect) {
  filtroSelect.addEventListener("change", function () {
    const seleccionado = this.value;
    const filas = document.querySelectorAll("#employeesTable tbody tr");

    filas.forEach(fila => {
      const estado = fila.querySelector("td.estado").dataset.estado;
      if (seleccionado === "todos" || estado === seleccionado) {
        fila.style.display = "";
      } else {
        fila.style.display = "none";
      }
    });
  });
}

// ===============================
// 🔹 Paginación
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const filasPorPagina = 6;
  const tabla = document.querySelector("#employeesTable tbody");
  const filas = tabla.querySelectorAll("tr");
  const paginacion = document.querySelector(".pagination");
  const inputPagina = document.getElementById("inputPagina");
  const btnIr = document.getElementById("btnIr");
  const mensajeError = document.getElementById("mensajeError");

  let paginaActual = 1;
  const totalPaginas = Math.ceil(filas.length / filasPorPagina);

  function mostrarPagina(numPagina) {
    paginaActual = numPagina;

    filas.forEach(f => (f.style.display = "none"));

    const inicio = (numPagina - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;

    filas.forEach((fila, i) => {
      if (i >= inicio && i < fin) fila.style.display = "";
    });

    generarBotones();
  }

  function generarBotones() {
    paginacion.innerHTML = "";

    // Botón anterior
    const prev = document.createElement("li");
    prev.className = `page-item ${paginaActual === 1 ? "disabled" : ""}`;
    prev.innerHTML = `<a class="page-link" href="#">«</a>`;
    prev.addEventListener("click", () => {
      if (paginaActual > 1) mostrarPagina(paginaActual - 1);
    });
    paginacion.appendChild(prev);

    // Botones numéricos
    for (let i = 1; i <= totalPaginas; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === paginaActual ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", () => mostrarPagina(i));
      paginacion.appendChild(li);
    }

    // Botón siguiente
    const next = document.createElement("li");
    next.className = `page-item ${paginaActual === totalPaginas ? "disabled" : ""}`;
    next.innerHTML = `<a class="page-link" href="#">»</a>`;
    next.addEventListener("click", () => {
      if (paginaActual < totalPaginas) mostrarPagina(paginaActual + 1);
    });
    paginacion.appendChild(next);
  }

  // Ir a página manual
  if (btnIr) {
    btnIr.addEventListener("click", () => {
      const num = parseInt(inputPagina.value);

      if (num >= 1 && num <= totalPaginas) {
        mostrarPagina(num);
        mensajeError.textContent = "";
        inputPagina.value = "";
      } else {
        mensajeError.textContent = `Página inválida (máx: ${totalPaginas})`;
        inputPagina.value = "";
      }
    });
  }

  mostrarPagina(1);
});

// ===============================
// 🔹 Agregar nuevo empleado
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("employeeForm");
  const tabla = document.querySelector("#employeesTable tbody");

  if (!form || !tabla) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreEmpleado").value.trim();
    const puesto = document.getElementById("puestoEmpleado").value.trim();
    const departamento = document.getElementById("departamentoEmpleado").value.trim();
    const sueldo = parseFloat(document.getElementById("sueldoEmpleado").value);
    const estado = "activo"; // por defecto

    if (!nombre || !puesto || !departamento || isNaN(sueldo)) return;

    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td>${nombre}</td>
      <td>${puesto}</td>
      <td>${departamento}</td>
      <td class="estado" data-estado="${estado}">
        <span class="badge bg-success">Activo</span>
      </td>
      <td class="text-end">
        <span class="sueldo-valor">${formateaMoneda(sueldo)}</span>
        <button class="btn btn-warning btn-sm ms-2 btn-editar">Editar</button>
      </td>
    `;

    tabla.appendChild(nuevaFila);

    form.reset();

    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("employeeModal"));
    modal.hide();
  });
});

// ===============================
// 🔹 Editar empleado
// ===============================
const employeesTable = document.getElementById("employeesTable");
const editForm = document.getElementById("editEmployeeForm");
const editModalEl = document.getElementById("editEmployeeModal");
const editModal = editModalEl ? new bootstrap.Modal(editModalEl) : null;

function estadoBadgeHTML(valor) {
  switch (valor) {
    case "activo": return '<span class="badge bg-success">Activo</span>';
    case "pendiente": return '<span class="badge bg-warning text-dark">Pendiente</span>';
    case "inactivo": return '<span class="badge bg-danger">Inactivo</span>';
    case "proceso": return '<span class="badge bg-primary">En Proceso</span>';
    default: return "";
  }
}
function formateaMoneda(num) {
  try { return "$" + Number(num).toLocaleString("es-CL"); }
  catch { return "$" + num; }
}

// Abrir modal con datos cargados
if (employeesTable && editModal) {
  employeesTable.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-editar");
    if (!btn) return;

    const tr = btn.closest("tr");
    const nombre = tr.cells[0].textContent.trim();
    const puesto = tr.cells[1].textContent.trim();
    const departamento = tr.cells[2].textContent.trim();
    const estado = tr.querySelector("td.estado").dataset.estado;
    const sueldoTxt = tr.querySelector(".sueldo-valor").textContent.trim().replace(/[.$]/g, "").replace(",", ".");

    document.getElementById("editNombre").value = nombre;
    document.getElementById("editPuesto").value = puesto;
    document.getElementById("editDepartamento").value = departamento;
    document.getElementById("editEstado").value = estado;
    document.getElementById("editSueldo").value = parseFloat(sueldoTxt);

    editForm.dataset.empleado = nombre;
    editModal.show();
  });

  // Guardar cambios
  editForm.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const nombre = document.getElementById("editNombre").value.trim();
    const puesto = document.getElementById("editPuesto").value.trim();
    const departamento = document.getElementById("editDepartamento").value.trim();
    const estado = document.getElementById("editEstado").value;
    const sueldo = parseFloat(document.getElementById("editSueldo").value);

    if (!nombre || !puesto || !departamento || isNaN(sueldo)) return;

    const tr = [...employeesTable.tBodies[0].rows].find(r => r.cells[0].textContent.trim() === editForm.dataset.empleado);
    if (!tr) return;

    tr.cells[0].textContent = nombre;
    tr.cells[1].textContent = puesto;
    tr.cells[2].textContent = departamento;

    const tdEstado = tr.querySelector("td.estado");
    tdEstado.dataset.estado = estado;
    tdEstado.innerHTML = estadoBadgeHTML(estado);

    tr.querySelector(".sueldo-valor").textContent = formateaMoneda(sueldo);

    editModal.hide();
  });
}
