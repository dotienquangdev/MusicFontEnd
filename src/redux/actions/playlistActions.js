export const updatePlaylist = (playlist, currentId) => ({
    type: 'UPDATE_PLAYLIST',
    payload: { playlist, currentId }
});
