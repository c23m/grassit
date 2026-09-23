import request from '@/utils/request'

export const getUser = (username) => request.get(`/users/${username}`)
export const deleteUser = (username) => request.delete(`/users/${username}`)
