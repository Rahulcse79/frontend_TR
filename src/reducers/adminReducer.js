import {
    LOGIN_ADMIN_REQUEST,
    LOGIN_ADMIN_SUCCESS,
    LOGIN_ADMIN_FAIL,
    LOAD_ADMIN_REQUEST,
    LOAD_ADMIN_SUCCESS,
    LOAD_ADMIN_FAIL,
    LOGOUT_ADMIN_SUCCESS,
    LOGOUT_ADMIN_FAIL,
    CLEAR_ERRORS,
} from '../constants/adminConstants';

export const adminReducer = (state = { admin: {} }, { type, payload }) => {
    switch (type) {
        case LOGIN_ADMIN_REQUEST:
        case LOAD_ADMIN_REQUEST:
            return {
                loading: true,
                isAuthenticated: false,
            };
        case LOGIN_ADMIN_SUCCESS:
        case LOAD_ADMIN_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                admin: payload,
            };
        case LOGOUT_ADMIN_SUCCESS:
            return {
                loading: false,
                admin: null,
                isAuthenticated: false,
            };
        case LOGIN_ADMIN_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                admin: null,
                error: payload,
            };
        case LOAD_ADMIN_FAIL:
            return {
                loading: false,
                isAuthenticated: false,
                admin: null,
                error: payload,
            }
        case LOGOUT_ADMIN_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};
