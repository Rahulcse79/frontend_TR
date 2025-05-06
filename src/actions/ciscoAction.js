import {
    CISCO_PROVISION_REQUEST,
    CISCO_PROVISION_SUCCESS,
    CISCO_PROVISION_FAIL,
    CISCO_DIAGNOSIS_REQUEST,
    CISCO_DIAGNOSIS_SUCCESS,
    CISCO_DIAGNOSIS_FAIL,
    CLEAR_ERRORS,
} from '../constants/ciscoConstants';
import axios from 'axios';

export const ciscoProvision = (deviceData) => async (dispatch) => {
    try {
        dispatch({ type: CISCO_PROVISION_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post(
            '/api/v1/cisco/provision',
            deviceData,
            config
        );

        dispatch({
            type: CISCO_PROVISION_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: CISCO_PROVISION_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const ciscoDiagnosis = () => async (dispatch) => {
    try {
        dispatch({ type: CISCO_DIAGNOSIS_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.get(
            '/api/v1/cisco/diagnosis',
            config
        );

        dispatch({
            type: CISCO_DIAGNOSIS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: CISCO_DIAGNOSIS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};