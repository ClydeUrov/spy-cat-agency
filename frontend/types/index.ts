export interface SpyCat {
  id: number
  name: string
  years_of_experience: number
  breed: string
  salary: number
}

export interface SpyCatFormData {
  name: string
  years_of_experience: number
  breed: string
  salary: number
}

export interface Target {
  id: number
  name: string
  country: string
  notes: string
  complete: boolean
  mission_id: number
}

export interface Mission {
  id: number
  cat_id?: number
  complete: boolean
  created_at: string
  targets: Target[]
  cat?: SpyCat
}
