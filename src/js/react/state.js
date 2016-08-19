import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'

// middleare parame is not checked well, some mw needs params but fail to provide make the dispatch dysfunctinal
export const reduxStore = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware
    )
);
console.log("message", reduxStore.getState());
