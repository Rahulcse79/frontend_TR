import {
    CISCO_PROVISION_REQUEST,
    CISCO_PROVISION_SUCCESS,
    CISCO_PROVISION_FAIL,
    CISCO_DIAGNOSIS_REQUEST,
    CISCO_DIAGNOSIS_SUCCESS,
    CISCO_DIAGNOSIS_FAIL,
    CLEAR_ERRORS,
} from '../constants/ciscoConstants';

export const ciscoProvisionReducer = (state = { ciscoProvision: {} }, { type, payload }) => {
    switch (type) {
        case CISCO_PROVISION_REQUEST:
            return {
                loading: true,
            };
        case CISCO_PROVISION_SUCCESS:
            return {
                ...state,
                loading: false,
                diagnosis: payload,
            };
        case CISCO_PROVISION_FAIL:
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

export const ciscoDiagnososReducer = (state = { ciscoDiagnosos: {} }, { type, payload }) => {
    switch (type) {
        case CISCO_DIAGNOSIS_REQUEST:
            return {
                loading: true,
            };
        case CISCO_DIAGNOSIS_SUCCESS:
            return {
                ...state,
                loading: false,
                diagnosis: payload,
            };
        case CISCO_DIAGNOSIS_FAIL:
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
