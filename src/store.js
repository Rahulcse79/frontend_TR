import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { adminReducer } from './reducers/adminReducer';
import { ipphoneReducer } from './reducers/ipphoneReducer';
import { ciscoProvisionReducer, ciscoDiagnososReducer } from './reducers/ciscoReducer';
import { linuxReducer } from './reducers/linuxReducer';

const reducer = combineReducers({

    admin: adminReducer,
    
    ciscoProvision: ciscoProvisionReducer,
    ciscoDiagnosos: ciscoDiagnososReducer,

    linux: linuxReducer,
    ipphone: ipphoneReducer,

});

const middleware = [thunk];

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;