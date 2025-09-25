document.addEventListener('DOMContentLoaded', ()=>{
  renderNavbar();
  const list = document.getElementById('blog-list');
  const items = [
    {id:1, titulo:'Tendencias Urbanas 2025', img:'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop', resumen:'Oversize, capas y tonos neutros siguen dominando la escena.', contenido:`La escena urbana se mueve hacia siluetas cómodas y versátiles. Los básicos de calidad (poleras 220–240gsm) se combinan con prendas statement como hoodies 400gsm o cargos con bolsillos técnicos.`},
    {id:2, titulo:'Guía de Tallas Rápida', img:'https://kedscl.vtexassets.com/arquivos/KDS_MUJER_CALZADO_DESKTOP.jpg', resumen:'Cómo medir y elegir el fit correcto sin equivocarte.', contenido:`Para poleras, mide de axila a axila y largo espalda. En pantalones, revisa cintura y tiro. Si te gusta el look oversize, sube una talla; para calce clásico, mantén tu talla habitual.`},
    {id:3, titulo:'Cuidado de Prendas', img:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop', resumen:'Haz que tus básicos duren más con estos tips.', contenido:`Lava del revés con agua fría, no planches estampados directos, evita secadora en prendas con elastano y guarda doblado para conservar el fit.`},
    {id:4, titulo:'Cómo armar un outfit RedThread', img:'https://images.unsplash.com/photo-1490481651871-b4f3d1d2189c?q=80&w=1200&auto=format&fit=crop', resumen:'Tres combinaciones listas para salir.', contenido:`1) Polera blanca + cargo gris + beanie. 2) Hoodie negro + jean indigo + gorra. 3) Polera gráfica + jogger arena + cinturón canvas.`},
  ];

  if(list){
    list.innerHTML = items.map(i=>`
      <div class="card" style="animation:fadeIn .25s ease both">
        <img src="${i.img}" alt="">
        <div class="body">
          <div style="font-weight:700">${i.titulo}</div>
          <p style="opacity:.8">${i.resumen}</p>
          <a class="btn outline" href="blog-detalle.html?id=${i.id}">Ver más</a>
        </div>
      </div>
    `).join('');
    renderFooter();
  }

  const detail = document.getElementById('blog-detalle');
  if(detail){
    const id = Number(new URL(location.href).searchParams.get('id')||'1');
    const i = items.find(x=>x.id===id) || items[0];
    detail.innerHTML = `
      <h2>${i.titulo}</h2>
      <img src="${i.img}" alt="" style="width:100%;max-height:320px;object-fit:cover;border-radius:12px;margin:8px 0">
      <p style="opacity:.9;line-height:1.7">${i.contenido}</p>
    `;
    renderFooter();
  }
});
