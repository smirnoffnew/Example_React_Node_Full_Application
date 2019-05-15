## Offerbrite recovery

The password recovery web app for Offerbrite mobile application.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Setup & Running
- install latest [Node.js](https://nodejs.org/en/).
- inside root project folder run `$ npm i`. It will install the project depedencies.
- run `$ npm start` for starting development server.
- run `$ npm run build` to make minimized and optimized build of the project. 

### Project structure
##### Root folder
- `<root>/config` folder contains all webpack config.
- `<root>/public` folder contains an HTML file and favicon.
- `<root>/scripts` folder contains 'create-react-app' package scripts.
- `<root>/src` folder contains all source code.
- `package-lock.json`, `package.json`, and `yarn.lock` files contain all information about dependencies.

##### 'src' folder
- The `index.js` file sets up our web application and connect it with Redux store and React Router `theme/` folder contains our custom style constants like colors, font sizes, etc.
- `store/` forder contains all configurations for using [Redux](https://redux.js.org/) library for app state management
- `services/` folder contains ulility functions and configuration for connecting application with the back-end.
- `reducers/` folder contains all app data and methods to manipulate this data via Redux library. Each reducer has its own directory. All reducers are combined inside `index.js` file.
- `components/` folder contains all UI parts in separate folders, where `index.js` file is a component structure (logic) and `style.css` contains all style properties for given component.
- `containers/` folder has the same structure as a `components` folder. Each container is a combination of our custom components from `components/` folder with HTML code. Here we create our UI for each app screen.
- `assets` folder contains all images and icons.

### Dependencies
- We use [axios](https://github.com/axios/axios) library for fetching data from the data base.
- We use [React Router](https://github.com/ReactTraining/react-router) package to manage app navigation.
- We use [redux-form](https://redux-form.com/) package to manage user inputs and validate them.
