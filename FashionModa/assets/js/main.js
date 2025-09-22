// assets/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // Navegación entre secciones
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
});
