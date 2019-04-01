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
import { toTitleCase, getIconFromString } from "../utils.js";

function processPopUpInfo(name, value) {
  let res = value;
  switch (name) {
    case 'nombre':
      res = toTitleCase(value)
      break;
    case 'imagen':
      {
        if(value.indexOf('http') == -1) {
          res = `https://drive.google.com/uc?export=view&id=${value}`;
        } else {
          res = value;
        }
      }
      break;
    default:
      res = value;
      break;
  }
  return res;
}

export default {
  name: "CulturalMap",
  data: () => ({
    map: null,
    grouped: {},
    clusters: {},
    markers: {}
  }),
  methods: {
    onEachFeature(feature, layer) {
      let popupInfo = document.getElementById("popupMarkup").innerHTML;
      const keys = Object.keys(feature.properties);
      if (keys.length && keys.length > 0) {
        for (let key in feature.properties) {
          console.log('>>>', key, 'by', feature.properties[key]);
          popupInfo = popupInfo.replace(
            `value_${key}`,
            processPopUpInfo(key, feature.properties[key])
          );
        }
        layer.bindPopup(popupInfo);
      }
    },
    getIcon(elm, change) {
      if (change) {
        return elm.replace("markers/", "SVG/");
      }
      return getIconFromString(elm);
    },
    async loadFile(name) {
      let result = {
        features: []
      };
      try {
        let base = window.baseUrl;
        if (!base) {
          base = location.href.split("/#")[0];
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
    pointToLayer(feature, latlng) {
      const nameStr = toTitleCase(feature.properties["nombre"]).trim();
      const areaStr = toTitleCase(feature.properties["area"]).trim();
      const iconUrl = this.getIcon(feature.properties.icono, true);
      const icon = window.L.icon({
        iconUrl: iconUrl,
        iconSize: [40, 40]
      });
      const markerData = {};
      if (iconUrl && icon) {
        markerData["icon"] = icon;
      }
      const marker = window.L.marker(latlng, markerData);
      this.markers[
        `${latlng.lat}_${latlng.lng}_${areaStr}_${nameStr}`
          .replace(/\s/g, "_")
          .toLowerCase()
      ] = marker;
      return marker;
    },
    makeGeoJson(element) {
      let layer = window.L.geoJSON(element, {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayer
      });
      return layer;
    },
    makeCluster(name) {
      const cluster = new window.L.MarkerClusterGroup({
        showCoverageOnHover: false,
        spiderfyDistanceMultiplier: 1,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true
      });
      this.clusters[toTitleCase(name)] = cluster;
      return cluster;
    },
    toAreas(acc, elm) {
      const area = elm.features[0].properties.area;
      if (!acc[area]) {
        acc[area] = [];
      }
      acc[area].push(elm);
      return acc;
    },
    processItemsForMenu(data) {
      return data.reduce((acc, file) => {
        //*
        const existents = [];
        file.features.forEach(item => {
          const area = toTitleCase(
            item.properties.area || "__undefined_area"
          ).trim();
          const categoria = toTitleCase(
            item.properties.categoria || "__undefined_category"
          ).trim();
          if (!acc[area]) {
            acc[area] = {};
          }
          if (!acc[area][categoria]) {
            acc[area][categoria] = [];
          }
          const elm_id = `${
            item.properties.nombre
          }${item.geometry.coordinates.join("_")}`;
          if (!existents.includes(elm_id)) {
            existents.push(elm_id);
            acc[area][categoria].push(item);
          }
        });
        // */
        return acc;
      }, {});
    },
    async loadFiles() {
      let data = await this.loadFile("all.json");
      let areas = data.reduce(this.toAreas, {});
      let areas_names = Object.keys(areas);
      let grouped = {};
      areas_names.forEach(name => {
        const element = areas[name];
        let cluster = this.makeCluster(name);
        let layer = this.makeGeoJson(element);
        cluster.addLayer(layer);
        cluster.addTo(this.map);
      });
      this.grouped = this.processItemsForMenu(data);
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

