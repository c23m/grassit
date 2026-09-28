import request from '@/utils/request'

export const getUser = (username) => request.get(`/user/${username}`)
export const deleteUser = (username) => request.delete(`/user/${username}`)