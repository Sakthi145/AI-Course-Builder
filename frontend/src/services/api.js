import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})



const PUBLIC_ENDPOINTS = ['/users/signup/', '/users/login/']

api.interceptors.request.use((config) => {

  const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
    config.url?.includes(endpoint)
  )

  if (!isPublicEndpoint) {

    const token = localStorage.getItem('access')

    if (token) {

      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})



api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
    }

    return Promise.reject(error)
  }
)



export default api