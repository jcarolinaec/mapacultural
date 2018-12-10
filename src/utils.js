
export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export function getIconUrlFromTag(feature) {
  return getIconFromString(feature.properties["tags"].trim());
}

const area_icons = {
  "patrimonio": "patrimonio material.svg",
  "patrimonio natural": "patrimonio natural.svg",
  "artes": "artes visuales.svg",
  "medios y contenidos": "literatura, publicaciones y prensa.svg",
  "industrias creativas": "servicios creativos.svg",
  "social y cívico": "gremiales y redes civicas.svg",
  "servicios y lugares complementarios": "servicios gastronomicos.svg",
  ////////
  "patrimonio inmaterial y conocimiento tradicional":"patrimonio inmaterial.svg",
  "patrimonio material e infraestructura cultural":"patrimonio material.svg",
  "patrimonio natural e infraestructura ecosistémica":"patrimonio natural.svg",
  "artes visuales":"artes visuales.svg",
  "artes escénicas":"artes escenicas.svg",
  "música":"musica.svg",
  "musica":"musica.svg",
  "literatura, publicaciones y prensa":"literatura, publicaciones y prensa.svg",
  "audiovisual":"audiovisual.svg",
  "media interactiva y nuevos medios":"media interactiva y nuevos medios.svg",
  "servicios creativos":"servicios creativos.svg",
  "diseño":"diseño.svg",
  "artesanías":"artesanias.svg",
  "grupos sociales, comunitarios o grupos poblacionales diferenciados ":"grupos sociales, comunitarios o grupos poblacionales diferenciados.svg",
  "gremiales y redes cívicas":"gremiales y redes civicas.svg",
  "centros educativos":"centros educativos.svg",
  "servicios gastronómicos":"servicios gastronomicos.svg",
  "entretenimiento y ocio nocturno":"entretenimiento y ocio nocturno.svg",
  "deportes, aire libre y aventura":"deportes, aire libre y aventura.svg",
  "servicios y operadores turísticos":"servicios y operadores turisticos.svg",
  "salud y bienestar":"salud y bienestar.svg",
  "centros religiosos":"centros religiosos.svg",
  "de compras: espacios comerciales":"de compras_ espacios comerciales.svg",
  "entidades gubernamentales y de servicios públicos":"entidades gubernamentales y de servicios publicos.svg",
  "otros servicios e industrias no culturales, turísticos ni creativos":"otros servicios e industrias no culturales, turisticos ni creativos.svg",
  "espacios urbanos":"espacios urbanos.svg"
};

export function getIconFromString(str) {
  const icon = area_icons[str.toLowerCase()];
  if(!icon)
  window.console.log('->', icon, str);
  return `SVG/${icon}`;
}
