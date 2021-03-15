import { shallowMount } from "@vue/test-utils";
import WeatherCard from "@/components/WeatherCard";

import axios from 'axios';

jest.mock('axios');

axios.get.mockImplementation(() => Promise.resolve({ data: { main: { temp: 19, humidity: 72, pressure: 712 }}}));

describe("WeatherCard normal temp", () => {
  const wrapper = shallowMount(WeatherCard, { propsData: {
    city: 'Test',
    countryCode: 'TS',
  }});

  it("renders title correctly", () => {
    expect(wrapper.get('.weather-card-header').text()).toBe('Test, TS');
  });

  it("renders temperature correctly", () => {
    expect(wrapper.get('.weather-card__temperature').text()).toBe('19');
  });

  it("renders humidity correctly", () => {
    expect(wrapper.get('.weather-card__humidity').text()).toBe('72%');
  });

  it("renders pressure correctly", () => {
    expect(wrapper.get('.weather-card__pressure').text()).toBe('712hPa');
  });

  it("renders temperature with correct class", () => {
    expect(wrapper.get('.weather-card__temperature').classes()).toContain('weather-card__temperature--normal');
  });
  
  it("does not render error frame", () => {
    expect(wrapper.find('.weather-card-error').exists()).toBe(false);
  });

  it("does not render loading frame", () => {
    expect(wrapper.find('.weather-card-loading-frame').exists()).toBe(false);
  });
});

axios.get.mockImplementation(() => Promise.resolve({ data: { main: { temp: -4, humidity: 72, pressure: 712 }}}));

describe("WeatherCard cold temp", () => {
  const wrapper = shallowMount(WeatherCard, { propsData: {
    city: 'Test',
    countryCode: 'TS',
  }});

  it("renders temperature with correct class", () => {
    expect(wrapper.get('.weather-card__temperature').classes()).toContain('weather-card__temperature--cold');
  });
});

axios.get.mockImplementation(() => Promise.resolve({ data: { main: { temp: 31, humidity: 72, pressure: 712 }}}));

describe("WeatherCard hot temp", () => {
  const wrapper = shallowMount(WeatherCard, { propsData: {
    city: 'Test',
    countryCode: 'TS',
  }});

  it("renders temperature with correct class", () => {
    expect(wrapper.get('.weather-card__temperature').classes()).toContain('weather-card__temperature--hot');
  });
});

axios.get.mockImplementation(() => Promise.reject());

describe("WeatherCard update error", () => {
  const wrapper = shallowMount(WeatherCard, { propsData: {
    city: 'Test',
    countryCode: 'TS',
  }});

  it("renders error frame", () => {
    expect(wrapper.find('.weather-card-error').exists()).toBe(true);
  });
});

axios.get.mockImplementation(() => new Promise(() => false));

describe("WeatherCard loading", () => {
  const wrapper = shallowMount(WeatherCard, { propsData: {
    city: 'Test',
    countryCode: 'TS',
  }});

  it("renders loading frame", () => {
    expect(wrapper.find('.weather-card-loading-frame').exists()).toBe(true);
  });
});