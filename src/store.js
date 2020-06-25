import reducers from './data/state.ts'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

export default function configureStore() {
    const store = createStore(reducers, applyMiddleware(thunk))
    return store
}