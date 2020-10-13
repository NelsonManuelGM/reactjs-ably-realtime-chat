import React from 'react';
import {ThemeProvider} from 'styled-components';
import {BrowserRouter} from "react-router-dom";
import {theme} from './appStyle';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import {roomReducer} from './context/reducers';
import Room from './components/room';


const store = createStore(combineReducers({
    roomReducer,
}), applyMiddleware(thunk));

function App() {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <BrowserRouter>
                        <Room/>
                    </BrowserRouter>
                </Provider>
            </ThemeProvider>
        </div>
    );
}

export default App;
