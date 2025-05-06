import {
    LINUX_REBOOT_REQUEST,
    LINUX_REBOOT_SUCCESS,
    LINUX_REBOOT_FAIL,
    LINUX_PROVISION_REQUEST,
    LINUX_PROVISION_SUCCESS,
    LINUX_PROVISION_FAIL,
    CLEAR_ERRORS,
} from '../constants/linuxConstants';

export const linuxRebootReducer = (state = { linuxReboot: {} }, { type, payload }) => {
    switch (type) {
        case LINUX_REBOOT_REQUEST:
            return {
                loading: true,
            };
        case LINUX_REBOOT_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case LINUX_REBOOT_FAIL:
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

export const linuxProvisionReducer = (state = { linuxProvision: {} }, { type, payload }) => {
    switch (type) {
        case LINUX_PROVISION_REQUEST:
            return {
                loading: true,
            };
        case LINUX_PROVISION_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case LINUX_PROVISION_FAIL:
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

