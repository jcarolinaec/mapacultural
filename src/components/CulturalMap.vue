<template>
  <div class="CulturalMap">
    <div class="CulturalMap-map" id="CulturalMap"></div>
    <cultural-items-menu
      :map="this.map"
      :markers="this.markers"
      :items="this.grouped"
      />
  </div>
</template>

<script>
// :icons="this.categoryImages"
import CulturalItemsMenu from "@/components/CulturalItemsMenu";
import {toTitleCase, getIconFromString} from '../utils.js';

export default {
  name: "CulturalMap",
  data: () => ({
    map: null,
    grouped: {},
    // categoryImages: {},
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
    getIcon(elm, change) {
      if(change) {
        return elm.replace('markers/', 'SVG/');
      }
      return getIconFromString(elm);
    },
    async loadFile(name) {
      let result = {
        features: []
      };
      try {
        let base = window.baseUrl;
        if(!base) {
          base = location.href.split('/#')[0];
        }
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
        this.loadFile("all.json")
      ]);
      // const categoryImages = {};
      data.forEach(elm => {
        const me = this;
        let layer = window.L.geoJSON(elm, {
          onEachFeature: this.onEachFeature,
          pointToLayer: function(feature, latlng) {
            const nameStr = toTitleCase(feature.properties["nombre"]).trim();
            const areaStr = toTitleCase(feature.properties["area"]).trim();
            const iconUrl = me.getIcon(feature.properties.icono, true);
            const icon = window.L.icon({
              iconUrl: iconUrl,
              iconSize: [40, 40]
            });
            const markerData = {};
            if (iconUrl && icon) {
              markerData["icon"] = icon;
            }
            const marker = window.L.marker(latlng, markerData);
            me.markers[`${latlng.lat}_${latlng.lng}_${areaStr}_${nameStr}`.replace(/\s/g,'_').toLowerCase()] = marker;
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
      // this.categoryImages = categoryImages;
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

