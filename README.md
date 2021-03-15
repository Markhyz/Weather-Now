# Weather Now

## Project setup

This project uses Node.js and NPM. The following versions were tested: Node.js v15.11.0, NPM v7.6.0 and Google Chrome v89.0.4389.82

To install the project, run:

```
npm install
```

This project uses the OpenWeather API and as such it needs an API Key. The OpenWeather API key must be defined as:

```
VUE_APP_OPEN_WEATHER_API_KEY="YOUR KEY"
``` 

inside a file named `.env.local` in the project root.

### Local environment

To run this project in a local environment, run the following command:

```
npm run serve
```

It should be acessible as `localhost:8080` or similiar.

### Testing

This project has unit testing and it can be executed as:

```
npm run test:unit
```
