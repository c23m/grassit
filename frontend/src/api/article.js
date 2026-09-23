import request from '@/utils/request'

export const getArticles = (params) => request.get('/article', { params })
export const getArticle = (identifier) => request.get(`/article/${identifier}`)
export const uploadArticle = (data) => request.post('/article', data)