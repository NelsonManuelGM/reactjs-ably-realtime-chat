import {ADDING_ADMIN_MESSAGE, ADDING_USER, REMOVE_USER} from './constants'


export const addRoomAdminMessage = (dispatch, messages) => {
    dispatch({
        type: ADDING_ADMIN_MESSAGE,
        messages: messages
    });
};

export const registerUser = (dispatch, users) => {
    dispatch({
        type: ADDING_USER,
        users: users
    });
};

export const removeUser = (dispatch, name) => {
    dispatch({
        type: REMOVE_USER,
        name: name
    });
};

