import {
    ANSIBLE_ADD_IPADDRESS_REQUEST,
    ANSIBLE_ADD_IPADDRESS_SUCCESS,
    ANSIBLE_ADD_IPADDRESS_FAIL,
    CLEAR_ERRORS,
} from '../constants/ansibleConstants';

export const ansibleReducer = (state = { ansible: {} }, { type, payload }) => {
    switch (type) {
        case ANSIBLE_ADD_IPADDRESS_REQUEST:
            return {
                loading: true,
            };
        case ANSIBLE_ADD_IPADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                status: payload,
            };
        case ANSIBLE_ADD_IPADDRESS_FAIL:
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