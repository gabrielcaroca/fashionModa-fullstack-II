const ctx = document.getElementById('chartUsuarios');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
    datasets: [{
      label: 'Usuarios activos',
      data: [120, 150, 180, 90, 200, 300, 220],
      backgroundColor: 'rgba(54, 162, 235, 0.7)'
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});
