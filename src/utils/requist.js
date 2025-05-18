// requist ?
// const API = "http://localhost:9000/api"
const API = "https://music-back-end.vercel.app/api"

export const _get = async (path) => {
    const response = await fetch(API + path, {
        method: 'GET',
        credentials: 'include',
    });
    return response;
}

export const get = async (path) => {
    const response = await fetch(API + path);
    const result = await response.json();
    return result;
}

export const _post = async (path, data) => {
    const isFormData = data instanceof FormData;
    const options = {
        method: "POST",
        credentials: 'include',
        body: data
    };
    if (!isFormData) {
        options.headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        };
        options.body = JSON.stringify(data);
    }
    console.log("pathhhhhh: " + API + path);

    const response = await fetch(API + path, options);
    return response;
};

export const _patch = async (path, data) => {
    const isFormData = data instanceof FormData;
    const options = {
        method: "PATCH",
        credentials: 'include',
        body: data
    };
    if (!isFormData) {
        options.headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        };
        options.body = JSON.stringify(data);
    }
    const response = await fetch(API + path, options);
    return response
};

export const _delete = async (path) => {
    const response = await fetch(API + path, {
        method: "DELETE",
        credentials: 'include'
    })
    return response
}