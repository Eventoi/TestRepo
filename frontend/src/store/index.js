import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './authReducer';

// объединяются редьюсеры (на будущее)
const rootReducer = combineReducers({
  auth: authReducer
});

// подключается thunk для асинхронных действий
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;