import {ADDING_ADMIN_MESSAGE, ADDING_USER, REMOVE_USER} from './constants'

const roomInitialState = {
    messages: [], // { user: 'admin', message: ''}
    users: [], // { name: 'userID', online:[true, false]}
};

export const roomReducer = (state = roomInitialState, action = {}) => {
    switch (action.type) {

        case ADDING_USER:
            return Object.assign({}, state, {users: [...action.users]});

        case REMOVE_USER:
            const newUsers = state.users.filter(user => user.name !== action.name);
            return Object.assign({}, state, {users: newUsers});


        case ADDING_ADMIN_MESSAGE:
            return Object.assign({}, state, {messages: action.messages});

        default:
            return state
    }
};