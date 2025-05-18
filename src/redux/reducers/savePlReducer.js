const initialState = {
    playlist: [],
    currentId: null
};

export default function savePlReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_PLAYLIST':
            return {
                playlist: action.payload.playlist,
                currentId: action.payload.currentId
            };
        default:
            return state;
    }
}
