import { useApiState } from './apiState'
import { GenomicData } from './models/GenomicData'
import { PatientDTO } from './models/PatientDTO'
import { PatientID } from './models/Patient'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'universal-cookie'
import router from './router'

// Initialize Axios instance
// =========================================================================

const apiURL = import.meta.env.ONCODASH_API_URL
const api = axios.create({ baseURL: apiURL })
const cookies = new Cookies()

const aiforia = axios.create({ baseURL: "http://127.0.0.1:9999"})


// Interceptors
// =========================================================================

api.interceptors.request.use(config => {
  useApiState().addRequest()
  return config
}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use(response => {
  useApiState().removeRequest()
  return response
}, (error) => {
  useApiState().removeRequest()
  return Promise.reject(error)
})

api.interceptors.response.use(response => {
  return response
}, (error) => {
  if (error.response.status === 401) router.push({ name: "LoginPage" })
  else return Promise.reject(error)
})


aiforia.interceptors.request.use(config => {
  useApiState().addRequest()
  return config
}, (error) => {
  return Promise.reject(error)
})

aiforia.interceptors.response.use(response => {
  useApiState().removeRequest()
  return response
}, (error) => {
  useApiState().removeRequest()
  return Promise.reject(error)
})

// API
// =========================================================================

export default {
  getPatientsList: async function (): Promise<AxiosResponse<Array<PatientDTO>>> {
    return await api.get('/api/clinical-overview/data/', {
      headers: {
        Authorization: `Token ${cookies.get('token')}`
      }
    })
  },
  getPatientClinical: async function (patientID: PatientID): Promise<AxiosResponse<PatientDTO>> {
    return await api.get(`/api/clinical-overview/data/${patientID}/`, {
      headers: {
        Authorization: `Token ${cookies.get('token')}`
      }
    })
  },
  getPatientGenomic: async function (patientID: PatientID): Promise<AxiosResponse<GenomicData>> {
    return await api.get(`/api/genomic-overview/data/${patientID}/`, {
      headers: {
        Authorization: `Token ${cookies.get('token')}`
      }
    })
  },
  login: async function (email: string, password: string) {
    return await api.post('/api-token-auth/', {
      username: email,
      password
    })
  },
  logout: async function () {
    return await api.get('/logout/', {
      headers: {
        'Authorization': `Token ${cookies.get('token')}`
      }
    })
  },
  getAIForIARunSummary: async function (aiforiarunid : AIForIARunID): Promise<AxiosResponse<AIForIARunSummary>> {
      console.log("AIForAIRunID:",aiforairunid);
      return await aiforia.get(`/v2/analysis/ia-runs/${aiforiarunid}/summary`, {
    })
  },
}
