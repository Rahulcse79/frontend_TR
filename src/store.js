import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { adminReducer } from './reducers/adminReducer';
import { ansibleReducer } from './reducers/ansibleReducer';
import { serverReducer } from './reducers/serverReducer';
import { ipphoneTimeScheduleReducer, ipphoneSyncReducer, ipphoneRebootReducer, ipphoneResetReducer , ipphoneProvisionReducer, ipphoneFirmwareReducer, ipphoneStatusReducer, ipphoneFaultReducer, ipphoneHistoryReducer, ipphoneFileUploadReducer  } from './reducers/ipphoneReducer';
import { ciscoProvisionReducer, ciscoDiagnososReducer } from './reducers/ciscoReducer';
import { linuxRebootReducer, linuxProvisionReducer } from './reducers/linuxReducer';

const reducer = combineReducers({

    admin: adminReducer,
    ansible: ansibleReducer,
    ciscoProvision: ciscoProvisionReducer,
    ciscoDiagnosos: ciscoDiagnososReducer,
    linuxReboot: linuxRebootReducer,
    linuxProvision: linuxProvisionReducer,
    server: serverReducer,
    ipphoneSync: ipphoneSyncReducer,
    ipphoneReboot: ipphoneRebootReducer,
    ipphoneReset: ipphoneResetReducer,
    ipphoneProvision: ipphoneProvisionReducer,
    ipphoneFirmware: ipphoneFirmwareReducer,
    ipphoneStatus: ipphoneStatusReducer,
    ipphoneTimeSchedule: ipphoneTimeScheduleReducer,
    ipphoneFault: ipphoneFaultReducer,
    ipphoneHistory: ipphoneHistoryReducer,
    ipphoneFileUpload: ipphoneFileUploadReducer,

});

const middleware = [thunk];

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;