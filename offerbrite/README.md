This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

### Setup
- install latest [Node.js](https://nodejs.org/en/)
- install [Yarn](https://yarnpkg.com/en/)
```sh
$ npm install -g yarn
```
- install [react-native-cli](https://github.com/facebook/react-native#readme)
```sh
$ npm install -g react-native-cli
```
- install the Java JRE and JDK [here](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- for Windows\Linux install [Android Studio](https://developer.android.com/studio/), for Mac install [Xcode](https://developer.apple.com/xcode/)

If you’re not using a physical device, it’s time to create your Android Virtual Device. There should be an “AVD Manager”
button near the top right of Android Studio.
If the AVD manager button is disabled (greyed out), double check that you are running the IDE as administrator and that
your platform tools / SDKs are all installed and up to date.
When it comes to creating the AVD, simply select the recommended options.

##### Path variable

We need to add the Android SDK to your path so the react-native scripts can call on avd.exe to communicate with the emulator.
In the start menu, search for “Environment variables”. Edit your User variables to include the following in your “Path”:
%LOCALAPPDATA%\Android\sdk\platform-tools
If you are encountered any errors try to google it and fix, then please do not forget to update this README with error and how you've fixed it for others.

### Run
`$ yarn` it will install the project depedencies
`$ react-native start`
`$ react-native run-android` or `$ react-native run-ios`

### Project structure
##### Root folder
- `<root>/android` and `<root>/ios` folders contain all configuration that is necessary for running application on different platforms
- `<root>/assets` folder contains all images, icons, etc.
- `.env` file contains all unsafe data like API keys, server IP and port.
- `.eslintrc` and `.babelrc` files contain configuration for linting (notify about any errors in code) and transpiling (converting new generation JavaScript (ES6+) code in ES5) code in development environment ([ESLint](https://eslint.org/), [Babel](https://babeljs.io/))
- `package.json`, `package-lock.json`, and `yarn.lock` files contain all information about project dependencies.
- `App.js` and `index.js` files start our app and register it as a React component.
- `src/` folder contains all source code divided in separate folders for better maintainance and management.

##### 'src' folder

- The `App.js` file sets up our root component and connect it with app navigation. Also, we connect a style theme of [Native base](https://docs.nativebase.io/docs/ThemeVariables.html) library here.
- `theme/` folder contains our custom style constants like colors, font sizes, etc.
- `store/` forder contains all configurations for using [Redux](https://redux.js.org/) library for app state management
- `services/` folder contains ulility functions for different purposes, configuration for connecting application with the back-end (API address, API endpoints).
- `reducers/` folder contains all app data and methods to manipulate this data via Redux library. Each reducer has its own directory. All reducers are combined inside `index.js` file.
- `boot/` folder contains files where we connect Redux store with our app.
- `components/` folder contains all UI parts in separate folders, where `index.js` file is a component structure (logic) and `style.js` contains all style properties for given component.
- `screens/` folder has the same structure as a `components` folder. Each screen is a combination of our custom components from `components/` folder with React Native components. Here we create our UI for each app screen.
- `hoc` folder contains helper functions as known as 'higher order components'

### Dependencies
- We use [axios](https://github.com/axios/axios) library for fetching data from the data base.
- For time/date manipulation we use [moment.js](https://momentjs.com/) library.
- We use [Native base](https://nativebase.io/) library to extend native components base.
- We use [React navigation](https://reactnavigation.org/) package to manage app navigation.
- We use [redux-form](https://redux-form.com/) package to manage user inputs and validate them.
- To implement all business logic on the frontend we use Redux, react-redux, redux-thunk, reselect, recompose nad other packages. Full list of dependencies is written in `package.json` file.
