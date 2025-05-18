import { get, _get, _delete, _patch } from "../utils/requist";

export const createSong = async (data) => {
    const response = await _get(`/song`, data);
    const result = await response.json();
    return result;
}
export const createSongs = async () => {
    const result = await get(`/song`);
    return result;
}

export const createSongId = async (id) => {
    const response = await _get(`/song/${id}`);
    const result = await response.json();
    return result;
}

export const createSongTopicId = async (topicId) => {
    const response = await _get(`/song?topicId=${topicId}`);
    const result = await response.json();
    return result;
};



const editSong = async (id) => {
    try {
        const response = await _get(`/song/edit/${id}`);
        if (!response.ok) {
            const text = await response.text();
            console.error("Lỗi từ server khi editSong:", text);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Lỗi khi gọi editSong:", error);
        return null;
    }
};

const editPatchSong = async (id, data) => {
    try {
        const response = await _patch(`/song/edit/${id}`, {
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const text = await response.text();
            console.error("Lỗi từ server khi editPatchSong:", text);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Lỗi khi gọi editPatchSong:", error);
        return null;
    }
};

const deleteSong = async (id) => {
    const response = await _delete(`/song/delete/${id}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }
    return await response.json();
}

export { deleteSong, editSong, editPatchSong };