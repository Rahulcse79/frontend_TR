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
import axios from 'axios';

export const logoutUser = () => async (dispatch) => {
    try {
        await axios.get('/api/v1/logout');
        dispatch({ type: LOGOUT_ADMIN_SUCCESS });
    } catch (error) {
        dispatch({
            type: LOGOUT_ADMIN_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const loginAdmin = (email, password) => async (dispatch) => {
    try {

        dispatch({ type: LOGIN_ADMIN_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await axios.post(
            '/api/v1/login',
            { email, password },
            config
        );

        dispatch({
            type: LOGIN_ADMIN_SUCCESS,
            payload: data.admin,
        });

    } catch (error) {
        dispatch({
            type: LOGIN_ADMIN_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const loadAdmin = () => async (dispatch) => {
    try {

        dispatch({ type: LOAD_ADMIN_REQUEST });

        const { data } = await axios.get('/api/v1/me');

        dispatch({
            type: LOAD_ADMIN_SUCCESS,
            payload: data.admin,
        });

    } catch (error) {
        dispatch({
            type: LOAD_ADMIN_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
