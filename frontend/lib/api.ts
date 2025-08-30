import axios from "axios"
import { handleApiError } from "./utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
})

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[v0] API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error("[v0] API Request Error:", error)
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[v0] API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error("[v0] API Response Error:", error)
    if (error.code === "ECONNREFUSED" || error.message === "Network Error") {
      const networkError = new Error("Backend server is not running. Please start the FastAPI server on port 8000.")
      networkError.name = "NetworkError"
      return Promise.reject(networkError)
    }
    const apiError = handleApiError(error)
    return Promise.reject(apiError)
  },
)

// Spy Cat API functions
export interface SpyCat {
  id: number
  name: string
  years_of_experience: number
  breed: string
  salary: number
}

export interface SpyCatCreate {
  name: string
  years_of_experience: number
  breed: string
  salary: number
}

export interface SpyCatUpdate {
  salary: number
}

export const spyCatApi = {
  // Get all spy cats
  getAll: async (): Promise<SpyCat[]> => {
    try {
      const response = await api.get("/cats/")
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get single spy cat
  getById: async (id: number): Promise<SpyCat> => {
    try {
      const response = await api.get(`/cats/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Create new spy cat
  create: async (cat: SpyCatCreate): Promise<SpyCat> => {
    try {
      const response = await api.post("/cats/", cat)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update spy cat salary
  update: async (id: number, update: SpyCatUpdate): Promise<SpyCat> => {
    try {
      const response = await api.put(`/cats/${id}`, update)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete spy cat
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/cats/${id}`)
    } catch (error) {
      throw error
    }
  },
}

// Mission and Target interfaces and API functions
export interface Target {
  id: number
  name: string
  country: string
  notes: string
  complete: boolean
  mission_id: number
}

export interface TargetCreate {
  name: string
  country: string
  notes: string
}

export interface TargetUpdate {
  notes?: string
  complete?: boolean
}

export interface Mission {
  id: number
  cat_id: number | null
  complete: boolean
  created_at: string
  targets: Target[]
  cat?: SpyCat
}

export interface MissionCreate {
  targets: TargetCreate[]
}

export interface MissionAssign {
  cat_id: number
}

// Missions API functions
export const missionApi = {
  // Get all missions
  getAll: async (): Promise<Mission[]> => {
    try {
      const response = await api.get("/missions/")
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get single mission
  getById: async (id: number): Promise<Mission> => {
    try {
      const response = await api.get(`/missions/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Create new mission with targets
  create: async (mission: MissionCreate): Promise<Mission> => {
    try {
      const response = await api.post("/missions/", mission)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Assign cat to mission
  assign: async (missionId: number, assignment: MissionAssign): Promise<Mission> => {
    try {
      const response = await api.put(`/missions/${missionId}/assign`, assignment)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete mission
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/missions/${id}`)
    } catch (error) {
      throw error
    }
  },
}

// Targets API functions
export const targetApi = {
  // Update target
  update: async (id: number, update: TargetUpdate): Promise<Target> => {
    try {
      const response = await api.put(`/targets/${id}`, update)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export const healthCheck = async (): Promise<{ isHealthy: boolean; error?: string }> => {
  try {
    console.log(`[v0] Checking backend health at ${API_BASE_URL}`)
    await api.get("/cats/")
    return { isHealthy: true }
  } catch (error: any) {
    console.error("[v0] Backend health check failed:", error)
    if (error.name === "NetworkError") {
      return {
        isHealthy: false,
        error: "Backend server is not running. Please start the FastAPI server on port 8000.",
      }
    }
    return {
      isHealthy: false,
      error: error.message || "Unknown error connecting to backend",
    }
  }
}

export default api
