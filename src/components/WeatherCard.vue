<template>
  <div class="weather-card">
    <div class="weather-card-header">{{ title }}</div>
    <div class="weather-card-content">
      <div class="weather-card-body" @click="toggleExpansion">
        <span class="weather-card__temperature" :class="temperatureClass">{{
          temperature
        }}</span>
      </div>
      <div class="weather-card-footer">
        <div v-show="isExpanded" class="weather-card__extra-weather-info">
          <div>
            <label>HUMIDITY</label>
            <span class="weather-card__humidity">{{ humidity }}%</span>
          </div>
          <div>
            <label>PRESSURE</label>
            <span class="weather-card__pressure">{{ pressure }}hPa</span>
          </div>
        </div>
        <div class="weather-card__update-info">
          {{ updateInfo }}
        </div>
      </div>
      <template v-if="!updateSuccess">
        <div class="weather-card-error">
          <span class="weather-card-error__message">
            Something went wrong
          </span>
          <button class="weather-card-error__button" @click="updateWeatherInfo">
            Try Again
          </button>
        </div>
      </template>
      <template v-if="isLoading">
        <div class="weather-card-loading-frame">
          <img class="weather-card__spinner" :src="spinner" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";

import Spinner from "@/assets/loader.svg";

export default {
  name: "WeatherCard",
  props: {
    city: String,
    countryCode: String,
    expanded: Boolean,
  },
  data() {
    return {
      temperature: 0,
      humidity: 0,
      pressure: 0,
      updateHandle: null,
      updateTime: null,
      updateSuccess: false,
      spinner: Spinner,
      isLoading: false,
      isExpanded: this.expanded,
    };
  },
  computed: {
    title() {
      return `${this.city}, ${this.countryCode}`;
    },
    temperatureClass() {
      const temperatureClassPrefix = "weather-card__temperature--";

      if (this.temperature <= 5) {
        return temperatureClassPrefix + "cold";
      } else if (this.temperature > 25) {
        return temperatureClassPrefix + "hot";
      } else {
        return temperatureClassPrefix + "normal";
      }
    },
    updateInfo() {
      return `Updated at ${this.updateTime?.format("hh:mm:ss A")}`;
    },
  },
  mounted() {
    this.updateWeatherInfo();
    this.updateHandle = global.setInterval(() => {
      if (this.updateSuccess) {
        this.updateWeatherInfo();
      }
    }, 3000);
  },
  beforeDestroy() {
    if (this.updateHandle) {
      global.clearInterval(this.updateHandle);
    }
  },
  methods: {
    toggleExpansion() {
      this.isExpanded = !this.isExpanded;
    },
    async updateWeatherInfo() {
      this.isLoading = true;

      const owAPIPrefix = "https://api.openweathermap.org/data/2.5/weather";
      const owAPIWeatherQuery = `q=${this.city},${this.countryCode}`;
      const owAPIUnits = "units=metric";
      const owAPIKey = `appid=${process.env.VUE_APP_OPEN_WEATHER_API_KEY}`;

      const cacheKey = `${this.city.toLowerCase()}/${this.countryCode.toLowerCase()}_weatherInfo`;
      const cachedWeatherInfo = JSON.parse(
        global.localStorage.getItem(cacheKey)
      );

      let weatherInfo;

      if (this.isValidCache(cachedWeatherInfo)) {
        weatherInfo = cachedWeatherInfo;
      } else {
        try {
          const { data } = await axios.get(
            `${owAPIPrefix}?${owAPIWeatherQuery}&${owAPIUnits}&${owAPIKey}`
          );
          const currentTime = dayjs();

          weatherInfo = {
            temperature: parseInt(data.main.temp),
            humidtity: data.main.humidity,
            pressure: data.main.pressure,
            updatedAt: currentTime.valueOf(),
            expiresAt: currentTime.add(10, "m").valueOf(),
          };

          global.localStorage.setItem(cacheKey, JSON.stringify(weatherInfo));
        } catch {
          weatherInfo = null;
        }
      }

      if (weatherInfo) {
        this.updateSuccess = true;

        this.temperature = weatherInfo?.temperature;
        this.humidity = weatherInfo?.humidtity;
        this.pressure = weatherInfo?.pressure;
        this.updateTime = dayjs(weatherInfo?.updatedAt);
      } else {
        this.updateSuccess = false;
      }

      this.isLoading = false;
    },
    isValidCache(cachedWeatherInfo) {
      if (!cachedWeatherInfo) return false;

      const currentTime = dayjs();

      return dayjs(cachedWeatherInfo.expiresAt).isAfter(currentTime);
    },
  },
};
</script>

<style lang="scss" scoped>
.weather-card {
  background: #ffffff;
  border: 1px solid var(--divider-color);
  border-radius: 4px;
  box-shadow: 2px 2px 4px var(--box-shadow-color);
  text-align: center;

  .weather-card-header {
    border-bottom: 1px solid var(--divider-color);
    font-size: 1.2rem;
    padding: 12px;
  }

  .weather-card-body {
    cursor: pointer;
    padding: 24px;

    .weather-card__temperature {
      font-size: 6rem;

      &::after {
        content: "°";
        font-size: 3rem;
        line-height: 5rem;
        vertical-align: top;
      }

      &.weather-card__temperature--normal {
        color: var(--orange-color);
      }

      &.weather-card__temperature--cold {
        color: var(--blue-color);
      }

      &.weather-card__temperature--hot {
        color: var(--red-color);
      }
    }
  }

  .weather-card-footer {
    background: var(--card-footer-color);
    padding: 12px;

    label {
      font-size: 0.8rem;
    }

    .weather-card__extra-weather-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;

      div {
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 8px;
      }
    }

    .weather-card__update-info {
      color: var(--text-light-color);
      font-size: 0.7rem;
    }
  }

  .weather-card-content {
    position: relative;

    .weather-card-error {
      align-items: center;
      background: white;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      position: absolute;
      top: 0;
      width: 100%;

      .weather-card-error__message {
        color: var(--red-color);
        size: 1.2rem;
        margin-bottom: 1.2rem;
      }

      .weather-card-error__button {
        all: unset;
        background: white;
        border: 2px solid black;
        border-radius: 100px;
        color: var(--text-color);
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0.6rem 1rem;
      }
    }

    .weather-card-loading-frame {
      align-items: center;
      background: white;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      position: absolute;
      top: 0;
      width: 100%;

      .weather-card__spinner {
        width: 25%;
      }
    }
  }
}
</style>
