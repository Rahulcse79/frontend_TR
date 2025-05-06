import {
    SERVER_STATUS_REQUEST,
    SERVER_STATUS_SUCCESS,
    SERVER_STATUS_FAIL,
    CLEAR_ERRORS,
} from '../constants/serverConstants';

export const serverReducer = (state = { server: {} }, { type, payload }) => {
    switch (type) {
        case SERVER_STATUS_REQUEST:
            return {
                loading: true,
            };
        case SERVER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case SERVER_STATUS_FAIL:
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