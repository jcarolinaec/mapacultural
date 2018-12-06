<template>
  <header>
    <b-navbar toggleable="md" type="dark" variant="info" class="Header">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">
      <picture>
        <img class="ImgBrand" src="../assets/logo-mapa.png" alt="Logo">
      </picture>
    </b-navbar-brand>
    <b-navbar-nav right class="SponsorsLogo">
      <picture>
        <img class="ImgSponsors" src="../assets/logos-sponsors.png" alt="Logo Sponsors">
      </picture>
    </b-navbar-nav>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="Navigation-main">
        <b-nav-item class="Navigation-mainItem Navigation-mainItemLink" href="#">Lugares</b-nav-item>
        <b-nav-item class="Navigation-mainItem Navigation-mainItemLink" href="#">Organizaciones</b-nav-item>
        <b-nav-item class="Navigation-mainItem Navigation-mainItemLink" href="#">Personas</b-nav-item>
        <b-nav-item class="Navigation-mainItem Navigation-mainItemLink" href="#">Circuitos</b-nav-item>
        <b-nav-item class="Navigation-mainItem Navigation-mainItemLink" href="#">Densidades</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto Navigation-second">
        <b-nav-item class="Navigation-secondItem" right> Estadisticas
        </b-nav-item>
        <b-nav-item class="Navigation-secondItem" right> Documentos
        </b-nav-item>
        <b-nav-item class="Navigation-secondItem" right> Cronicas de Rutas
        </b-nav-item>
        <b-nav-item class="Navigation-secondItem" right> Directorio
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</header>

    
</template>

<script>
export default {
    name: 'MapHeader'
}
</script>


<style lang="scss">

$orange: #e4502a;
$gray: #333333;
$light-blue: #35acaf;

.Header {
  background-color: $orange;
  background: url(../assets/banner.png) no-repeat center center; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  padding: 1.5em 1em !important;
  position: relative;
  margin: 0;
  max-width: 100%;
  height: auto;

  &-text {
    color: white;
    display: inline-block;
  }

  h1, h2 {
    margin: 0;
    padding: 0;
  }
}

@font-face {
  font-family: 'Barlow Semi Condensed Thin';
  src: url('../assets/fonts/BARLOWSEMICONDENSED-THIN.TTF');
}

@font-face {
  font-family: 'Barlow Semi Condensed ExtraLight';
  src: url('../assets/fonts/BARLOWSEMICONDENSED-EXTRALIGHTITALIC.TTF');
}

@font-face {
  font-family: 'Barlow Semi Condensed Medium';
  src: url('../assets/fonts/BARLOWSEMICONDENSED-MEDIUM.TTF');
}

.Navigation {

  &-main {
    display: flex;
    list-style: none;
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0;
    margin: 0;

    @media (max-width: 767px) {
      display: contents !important;
    }

    &Item {
      position: relative;
      background-color: $gray;
      border: 1px solid white;
      margin: 0 3px;
      padding: 2px 4px 2px 12px;
      min-width: 130px;
      text-align: center;
      &::before {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        color: white;
        border-right: 1px solid white;
        border-top: 1px solid white;
        background-color: $orange;
        left: 0;
        top: 50%;
        line-height: 10px;
        border-radius: 50%;
        transform: translate(-33%, -50%) rotateZ(45deg);
      }
      &:hover {
        background-color: $light-blue;
        font-family: 'Barlow Semi Condensed Medium', sans-serif;
      }
      a {
        padding: 0;
      }

    }

    &ItemLink {
      color: white;
      text-decoration: none;
      font-family: 'Barlow Semi Condensed ExtraLight', sans-serif;
      font-size: 16px;
      &:hover {
        font-family: 'Barlow Semi Condensed Medium', sans-serif;
        text-decoration: none;
        color: white;
      }
    }
  }

  &-second {
    display: inline-block !important;
    list-style: none;
    position: absolute;
    top: 10%;
    right: 1em;

    @media (max-width: 767px) {
      display: contents !important;
    }

    a {
      color: white !important;
      text-decoration: none;
      font-family: 'Barlow Semi Condensed Thin', sans-serif;
      font-size: 16px;
      margin-top: -35px;

    }

    & li::before {
      content: "\2022";
      color: white;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }
}

.ImgBrand {
  width: 90%;
}

.ImgSponsors {
  width: 70%;
}
.SponsorsLogo {
  
  @media (min-width: 768px) and (max-width: 1024px) {
    margin-left: 20%;
  }

  @media (min-width: 1025px) {
    margin-left: 28%;
  }
}
</style>

