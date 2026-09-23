import request from "@/utils/request"

export const login = (data) => request.post('/auth/login', data)
export const logout = () => request.post('/auth/logout')
export const register = (data) => request.post('/auth/register', data)
export const refresh = () => request.post('/auth/refresh')
export const getMe = () => request.get('/auth/me')