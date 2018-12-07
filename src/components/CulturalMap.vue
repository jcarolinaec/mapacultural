<template>
  <div class="CulturalMap">
    <div class="CulturalMap-map" id="CulturalMap"></div>
    <cultural-items-menu
      :map="this.map"
      :markers="this.markers"
      :items="this.grouped"
      :icons="this.categoryImages"/>
  </div>
</template>

<script>
import CulturalItemsMenu from "@/components/CulturalItemsMenu";
import {getIconUrlFromTag, getIconFromString, toTitleCase} from '../utils.js';

export default {
  name: "CulturalMap",
  data: () => ({
    map: null,
    grouped: {},
    categoryImages: {},
    markers: {},
  }),
  methods: {
    onEachFeature(feature, layer) {
      let popupInfo = document.getElementById('popupMarkup').innerHTML;
      const keys = Object.keys(feature.properties);
      if(keys.length && keys.length>0) {
        for (let key in feature.properties) {
          popupInfo = popupInfo.replace(`value_${key}`, feature.properties[key]);
        }
        layer.bindPopup(popupInfo);
      }
    },
    async loadFile(name) {
      let result = {
        features: []
      };
      try {
        const base = window.baseUrl;
        const response = await fetch(`${base}/data/${name}`);
        if (response.status >= 200 && response.status < 300) {
          result = await response.json();
        }
      } catch (error) {
        // nothing to do...
      }
      return result;
    },
    async loadFiles() {
      let data = await Promise.all([
        this.loadFile("Artes_escenicas_23.json"),
        this.loadFile("Artes_visuales_22.json"),
        this.loadFile("Artesanias_21.json"),
        this.loadFile("Audiovisual_7.json"),
        this.loadFile("Centros_Educativos_19.json"),
        this.loadFile("Centros_religiosos_17.json"),
        this.loadFile("Corto_Circuito_Ruta_25.json"),
        this.loadFile("De_compras_18.json"),
        this.loadFile("Deportes_20.json"),
        this.loadFile("Diseo_16.json"),
        this.loadFile("Entidades_gubernamentales_15.json"),
        this.loadFile("Entretenimiento_y_ocio_nocturno_13.json"),
        this.loadFile("Espacios_urbanos_12.json"),
        this.loadFile("Gremiales_redes_civicas_14.json"),
        this.loadFile("Grupos_sociales_comunitarios_10.json"),
        this.loadFile("La_Cuadra_24.json"),
        this.loadFile("Literatura_prensa_9.json"),
        this.loadFile("Media_Interactiva_8.json"),
        this.loadFile("Musica_6.json"),
        this.loadFile("Patrimonio_Inmaterial_5.json"),
        this.loadFile("Patrimonio_Material_4.json"),
        this.loadFile("Patrimonio_natural_3.json"),
        this.loadFile("Salud_bienestar_2.json"),
        this.loadFile("Servcios_creativos_1.json"),
        this.loadFile("Servcios_operadores_turist_0.json"),
        this.loadFile("Servicios_gastronomicos_11.json")
      ]);
      const categoryImages = {};
      data.forEach(elm => {
        const me = this;
        let layer = window.L.geoJSON(elm, {
          onEachFeature: this.onEachFeature,
          pointToLayer: function(feature, latlng) {
            const nameStr = toTitleCase(feature.properties["nombre"]).trim();
            const areaStr = toTitleCase(feature.properties["area"]).trim();
            const iconPathArea = getIconFromString(areaStr);
            const iconPath = getIconUrlFromTag(feature);
            if(iconPathArea) {
              categoryImages[areaStr] = iconPathArea;
            } else {
              categoryImages[areaStr] = iconPath;
            }
            categoryImages[toTitleCase(feature.properties.tags).trim()] = iconPath;
            const icon = window.L.icon({
              iconUrl: getIconUrlFromTag(feature),
              iconSize: [40, 40]
            });
            const markerData = {};
            if (icon) {
              markerData["icon"] = icon;
            }
            const marker = window.L.marker(latlng, markerData);
            me.markers[`${latlng.lat}_${latlng.lng}_${areaStr}_${nameStr}`.replace(/\s/g,'_')] = marker;
            return marker;
          }
        });
        let cluster = new window.L.MarkerClusterGroup({
          showCoverageOnHover: false,
          spiderfyDistanceMultiplier: 1
        });
        cluster.addLayer(layer);
        cluster.addTo(this.map);
      });
      const grouped = data.reduce((acc, file) => {
        //*
        const existents = [];
        file.features.forEach(item => {
          const area = toTitleCase(item.properties.area || '__undefined_area').trim();
          const categoria = toTitleCase(item.properties.categoria || '__undefined_category').trim();
          if(!acc[area]) {
            acc[area] = {};
          }
          if(!acc[area][categoria]) {
            acc[area][categoria] = [];
          }
          const elm_id = `${item.properties.nombre}${item.geometry.coordinates.join('_')}`;
          if(!existents.includes(elm_id)) {
            existents.push(elm_id);
            acc[area][categoria].push(item);
          }
        });
        // */
        return acc;
      }, {});
      this.grouped = grouped;
      this.categoryImages = categoryImages;
    }
  },
  mounted() {
    const INITIAL_POS = [4.7906272149218285, -75.68756103515626];
    this.map = window.L.map("CulturalMap").setView(INITIAL_POS, 13);
    window.L.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoib2dyYW5hZGEiLCJhIjoiY2puZ2ljYTg1MDNobjNrcGFlNndwOHR6ZiJ9.T4ym4ItHL-gaYd-uHmdeZQ",
      {
        maxZoom: 18,
        attribution: "Jennifer Esguerra + Juliana Aguirre",
        id: "mapbox.streets"
      }
    ).addTo(this.map);
    this.map.on("click", function(e) {
      window.console.log({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
    this.loadFiles();
  },
  components: {
    CulturalItemsMenu
  }
};
</script>

<style lang="scss">
.CulturalMap {
  position: relative;

  &-map {
    height: calc(100vh - 102px);
  }
}
</style>

