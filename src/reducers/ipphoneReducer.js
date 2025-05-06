import {
    IPPHONE_PROVISION_REQUEST,
    IPPHONE_PROVISION_SUCCESS,
    IPPHONE_PROVISION_FAIL,
    IPPHONE_REBOOT_REQUEST,
    IPPHONE_REBOOT_SUCCESS,
    IPPHONE_REBOOT_FAIL,
    IPPHONE_RESET_REQUEST,
    IPPHONE_RESET_SUCCESS,
    IPPHONE_RESET_FAIL,
    IPPHONE_FIRMWARE_REQUEST,
    IPPHONE_FIRMWARE_SUCCESS,
    IPPHONE_FIRMWARE_FAIL,
    IPPHONE_STATUS_REQUEST,
    IPPHONE_STATUS_SUCCESS,
    IPPHONE_STATUS_FAIL,
    IPPHONE_HISTORY_REQUEST,
    IPPHONE_HISTORY_SUCCESS,
    IPPHONE_HISTORY_FAIL,
    IPPHONE_TIMESCHEDULE_REQUEST,
    IPPHONE_TIMESCHEDULE_SUCCESS,
    IPPHONE_TIMESCHEDULE_FAIL,
    IPPHONE_FAULT_REQUEST,
    IPPHONE_FAULT_SUCCESS,
    IPPHONE_FAULT_FAIL,
    IPPHONE_SYNC_REQUEST,
    IPPHONE_SYNC_SUCCESS,
    IPPHONE_SYNC_FAIL,
    IPPHONE_FILEUPLOAD_REQUEST,
    IPPHONE_FILEUPLOAD_SUCCESS,
    IPPHONE_FILEUPLOAD_FAIL,
    CLEAR_ERRORS,
} from '../constants/ipphoneConstants';

export const ipphoneFileUploadReducer = (state = { ipphoneFileUpload: {} }, { type, payload }) => {
    switch (type) {
        case IPPHONE_FILEUPLOAD_REQUEST:
            return {
                loading: true,
            };
        case IPPHONE_FILEUPLOAD_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case IPPHONE_FILEUPLOAD_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const ipphoneHistoryReducer = (state = { ipphoneHistory: {} }, { type, payload }) => {
    switch (type) {
        case IPPHONE_HISTORY_REQUEST:
            return {
                loading: true,
            };
        case IPPHONE_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                data: payload,
            };
        case IPPHONE_HISTORY_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const ipphoneFaultReducer = (state = { ipphoneFault: {} }, { type, payload }) => {
    switch (type) {
        case IPPHONE_FAULT_REQUEST:
            return {
                loading: true,
            };
        case IPPHONE_FAULT_SUCCESS:
            return {
                ...state,
                loading: false,
                data: payload,
            };
        case IPPHONE_FAULT_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const ipphoneTimeScheduleReducer = (state = { ipphoneTimeSchedule: {} }, { type, payload }) => {
    switch (type) {
        case IPPHONE_TIMESCHEDULE_REQUEST:
            return {
                loading: true,
            };
        case IPPHONE_TIMESCHEDULE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case IPPHONE_TIMESCHEDULE_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const ipphoneStatusReducer = (state = { ipphoneStatus: {} }, { type, payload }) => {
    switch (type) {
        case IPPHONE_STATUS_REQUEST:
            return {
                loading: true,
            };
        case IPPHONE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: payload,
            };
        case IPPHONE_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const ipphoneFirmwareReducer = (state = { ipphoneFirmware: {} }, { type, payload }) => {
    switch (type) {
        case IPPHONE_FIRMWARE_REQUEST:
            return {
                loading: true,
            };
        case IPPHONE_FIRMWARE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case IPPHONE_FIRMWARE_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const ipphoneProvisionReducer = (state = { ipphoneProvision: {} }, { type, payload }) => {
    switch (type) {
        case IPPHONE_PROVISION_REQUEST:
            return {
                loading: true,
            };
        case IPPHONE_PROVISION_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case IPPHONE_PROVISION_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const ipphoneResetReducer = (state = { ipphoneReset: {} }, { type, payload }) => {
    switch (type) {
        case IPPHONE_RESET_REQUEST:
            return {
                loading: true,
            };
        case IPPHONE_RESET_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case IPPHONE_RESET_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const ipphoneRebootReducer = (state = { ipphoneReboot: {} }, { type, payload }) => {
    switch (type) {
        case IPPHONE_REBOOT_REQUEST:
            return {
                loading: true,
            };
        case IPPHONE_REBOOT_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case IPPHONE_REBOOT_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const ipphoneSyncReducer = (state = { ipphoneSync: {} }, { type, payload }) => {
    switch (type) {
        case IPPHONE_SYNC_REQUEST:
            return {
                loading: true,
            };
        case IPPHONE_SYNC_SUCCESS:
            return {
                ...state,
                loading: false,
                data: payload,
            };
        case IPPHONE_SYNC_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};