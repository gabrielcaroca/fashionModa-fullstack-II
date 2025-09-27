document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("chartUsuarios");

  if (ctx) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        datasets: [{
          label: "Usuarios activos",
          data: [120, 150, 180, 90, 200, 170, 140],
          backgroundColor: "rgba(54, 162, 235, 0.7)"
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
});
