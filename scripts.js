// Inicializando o mapa
var map = L.map('map').setView([-12.45, -38.97], 4); // Latitude e Longitude iniciais

// Carregando o mapa base
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>'
});

// Adicionando uma camada de controle para alternar entre diferentes camadas de mapa base
var baseLayers = {
  "Mapa": osmLayer,
  "Satélite": satelliteLayer,
};

L.control.layers(baseLayers).addTo(map);

// Adicionando uma bússola (norte)
var north = L.control({ position: "topright" });
north.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
  div.innerHTML = '<img src="compass.png" alt="Norte" style="width: 50px; height: 50px;">'; // Caminho da imagem da bússola
  return div;
};
north.addTo(map);

// Adicionando as legendas fixas no mapa
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.style.backgroundColor = "white";
  div.style.padding = "10px";
  div.style.border = "1px solid #ccc";
  div.style.borderRadius = "8px";
  div.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  div.innerHTML = `
    
    <i style="background: #3388ff; width: 12px; height: 12px; display: inline-block; margin-right: 5px;"></i> Roteiros turísticos<br>`
  ;
  return div;
};
legend.addTo(map);

// Adicionando um botão para exibir o mapa em tela cheia
var fullscreenControl = L.control({ position: "topright" });
fullscreenControl.onAdd = function(map) {
  var container = L.DomUtil.create("div", "fullscreen-control");
  container.style.backgroundColor = "white";
  container.style.padding = "10px";
  container.style.border = "1px solid #ccc";
  container.style.borderRadius = "8px";
  container.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  container.style.cursor = "pointer";
  container.innerHTML = "<strong>🖵 Tela Cheia</strong>";
  container.onclick = function() {
    var mapElement = document.getElementById("map");
    if (!document.fullscreenElement) {
      mapElement.requestFullscreen().catch(err => {
        console.error(`Erro ao entrar em tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  return container;
};
fullscreenControl.addTo(map);

// Adicionando uma escala ao mapa
L.control.scale().addTo(map);

// Carregando os dados JSON com as comunidades quilombolas
fetch('rotas_completo.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(comunidade => {
      // Adicionando marcadores no mapa
      var marker = L.marker([comunidade.y, comunidade.x]).addTo(map);
      
      // Criando um pop-up com informações
      marker.bindPopup(`
        <div style="font-size: 16px; max-width: 300px;">
          <strong>${comunidade.municipio}</strong><br>
          <strong>${comunidade.uf}</strong><br>
          ${comunidade.roteiros}<br>
          <strong>${comunidade.contato || ''}</strong><br>
        </div>
      `);
    });
  })
  .catch(error => console.error('Erro ao carregar os dados:', error));