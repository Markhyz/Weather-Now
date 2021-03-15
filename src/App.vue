<template>
  <div id="app" class="weather-now">
    <header class="weather-now-header">
      <img class="weather-now-header__logo" :src="logoImage" />
    </header>
    <main class="weather-now-body">
      <div class="weather-now__card">
        <WeatherCard city="Nuuk" country-code="GL" />
      </div>
      <div class="weather-now__card">
        <WeatherCard city="Urubici" country-code="BR" expanded />
      </div>
      <div class="weather-now__card">
        <WeatherCard city="Nairobi" country-code="KE" />
      </div>
    </main>
  </div>
</template>

<script>
import Logo from "@/assets/logo.svg";
import WeatherCard from "@/components/WeatherCard";

export default {
  name: "App",
  components: {
    WeatherCard,
  },
  data() {
    return {
      logoImage: Logo,
    };
  },
};
</script>

<style>
body {
  margin: 0;
}

:root {
  --app-background-color: #f1f1f1;
  --card-footer-color: #f1f1f180;
  --divider-color: #ebebeb;
  --box-shadow-color: #33333319;
  --text-light-color: #b4b4b4;
  --text-color: #737c84;
  --blue-color: #69a3ff;
  --orange-color: #ff9632;
  --red-color: #ed1946;
}

label {
  color: var(--text-light-color);
  margin-bottom: 4px;
}
</style>

<style lang="scss" scoped>
.weather-now {
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  font-family: Helvetica, Arial;
  height: 100vh;

  .weather-now-header {
    align-items: center;
    flex-shrink: 0;
    border-bottom: 1px solid var(--divider-color);
    display: flex;
    height: 5%;
    justify-content: center;
    padding: 8px 0;

    .weather-now-header__logo {
      height: 70%;
    }
  }

  .weather-now-body {
    align-items: center;
    background: var(--app-background-color);
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    padding: 0 5%;
    overflow: auto;

    .weather-now__card {
      width: 30%;
    }

    @media only screen and (max-device-width: 768px) {
      flex-direction: column;
      padding: 2rem;

      .weather-now__card {
        width: 100%;

        &:not(:last-child) {
          padding-bottom: 2rem;
        }
      }
    }
  }
}
</style>
