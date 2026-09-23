export async function request(url, options = {}) {
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
    }
    return response.json();
}

export function get(url) {
    return request(url)
}

export function post(url, data) {
    return request(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
}

export function put(url, data) {
    return request(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
}

export function del(url) {
    return request(url, {
        method: "DELETE"
    })
}