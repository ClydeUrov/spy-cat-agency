"use client"

import { useState, useEffect } from "react"
import type { SpyCat, SpyCatFormData } from "@/types"
import { spyCatApi, healthCheck } from "@/lib/api"
import type { ApiError } from "@/lib/utils"
import SpyCatForm from "@/components/SpyCatForm"
import SpyCatList from "@/components/SpyCatList"
import LoadingSpinner from "@/components/LoadingSpinner"
import ErrorAlert from "@/components/ErrorAlert"

export default function HomePage() {
  const [cats, setCats] = useState<SpyCat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCat, setEditingCat] = useState<SpyCat | null>(null)
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null)

  // Load spy cats on component mount
  useEffect(() => {
    checkBackendHealth()
    loadCats()
  }, [])

  const checkBackendHealth = async () => {
    const healthResult = await healthCheck()
    setBackendHealthy(healthResult.isHealthy)
    if (!healthResult.isHealthy) {
      setError({
        message: "Backend server is not responding",
        details: healthResult.error || "Make sure the FastAPI server is running on http://localhost:8000",
      })
    }
  }

  const loadCats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await spyCatApi.getAll()
      setCats(data)
      setBackendHealthy(true)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      setBackendHealthy(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCat = async (catData: SpyCatFormData) => {
    try {
      setError(null)
      const newCat = await spyCatApi.create(catData)
      setCats([...cats, newCat])
      setShowForm(false)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      throw err
    }
  }

  const handleUpdateCat = async (id: number, salary: number) => {
    try {
      setError(null)
      const updatedCat = await spyCatApi.update(id, { salary })
      setCats(cats.map((cat) => (cat.id === id ? updatedCat : cat)))
      setEditingCat(null)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      throw err
    }
  }

  const handleDeleteCat = async (id: number) => {
    if (!confirm("Are you sure you want to delete this spy cat?")) {
      return
    }

    try {
      setError(null)
      await spyCatApi.delete(id)
      setCats(cats.filter((cat) => cat.id !== id))
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Spy Cats</h1>
          <p className="mt-2 text-sm text-gray-700">Manage your elite team of spy cats and their assignments.</p>
          {backendHealthy === false && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Backend disconnected
            </div>
          )}
          {backendHealthy === true && (
            <div className="mt-2 flex items-center text-sm text-green-600">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Backend connected
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
            disabled={!backendHealthy}
          >
            Add Spy Cat
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorAlert message={error.message} details={error.details} onDismiss={() => setError(null)} />
        </div>
      )}

      <div className="mt-8">
        <SpyCatList
          cats={cats}
          onEdit={setEditingCat}
          onDelete={handleDeleteCat}
          editingCat={editingCat}
          onUpdateCat={handleUpdateCat}
          onCancelEdit={() => setEditingCat(null)}
        />
      </div>

      {showForm && <SpyCatForm onSubmit={handleCreateCat} onCancel={() => setShowForm(false)} />}
    </div>
  )
}
