const initialState = {
    profileData: null,
    loading: true,
    error: null
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PROFILE_SUCCESS':
            return {
                ...state,
                profileData: action.payload,
                loading: false,
                error: null
            };
        case 'FETCH_PROFILE_ERROR':
            return {
                ...state,
                profileData: null,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default profileReducer;
