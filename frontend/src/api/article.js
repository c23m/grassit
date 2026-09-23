import request from '@/utils/request'

export const getArticles = (params) => request.get('/articles', { params })
export const getArticle = (identifier) => request.get(`/articles/${identifier}`)
export const uploadArticle = (data) => request.post('/articles', data)
