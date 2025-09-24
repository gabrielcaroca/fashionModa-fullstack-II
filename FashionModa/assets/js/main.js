document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // 🔹 Navegación entre secciones
  // ===============================
  document.querySelectorAll('.nav-link[data-target]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Ocultar todas las secciones
      document.querySelectorAll('.page').forEach(sec => sec.classList.add('d-none'));

      // Mostrar la sección destino
      const targetId = this.getAttribute('data-target');
      document.getElementById(targetId).classList.remove('d-none');

      // Cambiar estado activo en el menú
      document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ===============================
  // 🔹 Filtro de estado (Orders)
  // ===============================
  const filtroSelect = document.getElementById("filtroEstado");
  if (filtroSelect) {
    filtroSelect.addEventListener("change", function () {
      const seleccionado = this.value;
      const filas = document.querySelectorAll("#ordersTable tbody tr");

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
  // 🔹 Validaciones en formulario (si existe)
  // ===============================
  const form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let valido = true;

      const customer = document.getElementById("customer");
      if (customer.value.trim() === "") {
        customer.classList.add("is-invalid");
        valido = false;
      } else {
        customer.classList.remove("is-invalid");
      }

      const amount = document.getElementById("amount");
      if (amount.value.trim() === "" || Number(amount.value) <= 0) {
        amount.classList.add("is-invalid");
        valido = false;
      } else {
        amount.classList.remove("is-invalid");
      }

      if (valido) {
        alert("✅ Orden guardada correctamente");
        form.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
        modal.hide();
      }
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const filasPorPagina = 6;
  const tabla = document.querySelector("#orders tbody");
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
  btnIr.addEventListener("click", () => {
    const num = parseInt(inputPagina.value);

    if (num >= 1 && num <= totalPaginas) {
      mostrarPagina(num);
      mensajeError.textContent = ""; // limpiar mensaje
      inputPagina.value = ""; // limpiar input después de uso
    } else {
      mensajeError.textContent = `Opción de página inválida o no existe, ingrese un número válido (máx: ${totalPaginas})`;
      inputPagina.value = ""; // limpiar input
    }
  });

  mostrarPagina(1);
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");
  const tabla = document.getElementById("ordersTable").querySelector("tbody");

  // Para ir generando el número de orden automáticamente
  let contadorOrden = 1020; // último SO1020 en tu tabla inicial

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cliente = document.getElementById("cliente").value.trim();
    const estado = document.getElementById("estado").value;
    const monto = document.getElementById("monto").value;

    if (!cliente || !estado || !monto) return;

    contadorOrden++; // nueva orden consecutiva
    const fecha = new Date().toISOString().split("T")[0]; // fecha actual YYYY-MM-DD
    const orden = "SO" + contadorOrden;

    // Badge según estado
    let badgeClass = "";
    let estadoTexto = "";
    switch (estado) {
      case "enviado":
        badgeClass = "bg-success";
        estadoTexto = "Enviado";
        break;
      case "pendiente":
        badgeClass = "bg-warning text-dark";
        estadoTexto = "Pendiente";
        break;
      case "cancelado":
        badgeClass = "bg-danger";
        estadoTexto = "Cancelado";
        break;
      case "proceso":
        badgeClass = "bg-primary";
        estadoTexto = "En Proceso";
        break;
    }

    // Crear fila nueva (con botón Editar incluido)
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td>${fecha}</td>
      <td>${orden}</td>
      <td>${cliente}</td>
      <td class="estado" data-estado="${estado}">
        <span class="badge ${badgeClass}">${estadoTexto}</span>
      </td>
      <td class="text-end">
        <span class="monto-valor">$${Number(monto).toLocaleString("es-CL")}</span>
        <button class="btn btn-warning btn-sm ms-2 btn-editar" data-order="${orden}">Editar</button>
      </td>
    `;

    tabla.appendChild(nuevaFila);

    // Resetear formulario
    form.reset();

    // Cerrar modal con Bootstrap
    const modal = bootstrap.Modal.getInstance(document.getElementById("orderModal"));
    modal.hide();
  });
});



// === EDITAR ORDEN (delegación) ===
const ordersTable = document.getElementById('ordersTable');
const editForm = document.getElementById('editOrderForm');
const editModalEl = document.getElementById('editOrderModal');
const editModal = editModalEl ? new bootstrap.Modal(editModalEl) : null;

function estadoBadgeHTML(valor) {
  switch (valor) {
    case 'enviado':   return '<span class="badge bg-success">Enviado</span>';
    case 'pendiente': return '<span class="badge bg-warning text-dark">Pendiente</span>';
    case 'cancelado': return '<span class="badge bg-danger">Cancelado</span>';
    case 'proceso':   return '<span class="badge bg-primary">En Proceso</span>';
    default:          return '';
  }
}
function formateaMoneda(num) {
  // $xxx.xxx con separadores de miles estilo es-CL
  try { return '$' + Number(num).toLocaleString('es-CL'); }
  catch { return '$' + num; }
}

// Abrir modal precargado
if (ordersTable && editModal) {
  ordersTable.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-editar');
    if (!btn) return;

    const tr = btn.closest('tr');
    const fecha   = tr.cells[0].textContent.trim();           // ya viene YYYY-MM-DD
    const orden   = tr.cells[1].textContent.trim();
    const cliente = tr.cells[2].textContent.trim();
    const estado  = tr.querySelector('td.estado').dataset.estado;
    const montoTxt= tr.querySelector('.monto-valor').textContent.trim().replace(/[.$]/g,'').replace(',', '.');

    document.getElementById('editFecha').value = fecha; // si no acepta, conviértelo a YYYY-MM-DD
    document.getElementById('editOrden').value = orden;
    document.getElementById('editCliente').value = cliente;
    document.getElementById('editEstado').value = estado;
    document.getElementById('editMonto').value = parseFloat(montoTxt);

    // guardar referencia al tr editado
    editForm.dataset.order = orden;

    editModal.show();
  });

  // Guardar cambios
  editForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const orden   = editForm.dataset.order;
    const fecha   = document.getElementById('editFecha').value;
    const cliente = document.getElementById('editCliente').value.trim();
    const estado  = document.getElementById('editEstado').value;
    const monto   = parseFloat(document.getElementById('editMonto').value);

    if (!cliente || isNaN(monto) || monto < 0) return;

    const tr = [...ordersTable.tBodies[0].rows].find(r => r.cells[1].textContent.trim() === orden);
    if (!tr) return;

    tr.cells[0].textContent = fecha;
    tr.cells[2].textContent = cliente;

    const tdEstado = tr.querySelector('td.estado');
    tdEstado.dataset.estado = estado;
    tdEstado.innerHTML = estadoBadgeHTML(estado);

    tr.querySelector('.monto-valor').textContent = formateaMoneda(monto);

    editModal.hide();
  });
}

// Si creas nuevas órdenes por JS, asegúrate de generar la celda monto así:
function celdaMontoConBoton(montoNum, orderId) {
  return `<span class="monto-valor">${formateaMoneda(montoNum)}</span>
          <button class="btn btn-warning btn-sm ms-2 btn-editar" data-order="${orderId}">Editar</button>`;
}
