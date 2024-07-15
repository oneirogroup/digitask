import { SET_USER } from '../actions/auth';

const initialState = {
    isLoggedIn: false,
    user: null, 
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            };
        default:
            return state;
    }
};

export default authReducer;
