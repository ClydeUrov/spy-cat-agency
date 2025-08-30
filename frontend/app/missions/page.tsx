"use client"

import { useState, useEffect } from "react"
import { missionApi, spyCatApi, healthCheck, type Mission, type SpyCat } from "@/lib/api"
import type { ApiError } from "@/lib/utils"
import MissionForm from "@/components/MissionForm"
import MissionList from "@/components/MissionList"
import LoadingSpinner from "@/components/LoadingSpinner"
import ErrorAlert from "@/components/ErrorAlert"

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [cats, setCats] = useState<SpyCat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null)

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

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [missionsData, catsData] = await Promise.all([missionApi.getAll(), spyCatApi.getAll()])

      setMissions(missionsData)
      setCats(catsData)
      setBackendHealthy(true)
    } catch (error: any) {
      const apiError = error as ApiError
      setError(apiError)
      setBackendHealthy(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkBackendHealth()
    fetchData()
  }, [])

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    fetchData()
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
          <h1 className="text-2xl font-semibold text-gray-900">Missions</h1>
          <p className="mt-2 text-sm text-gray-700">Manage spy missions, assign targets, and track mission progress.</p>
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
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!backendHealthy}
          >
            Create Mission
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorAlert message={error.message} details={error.details} onDismiss={() => setError(null)} />
        </div>
      )}

      <div className="mt-8">
        {missions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No missions</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first mission with targets.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!backendHealthy}
              >
                Create Mission
              </button>
            </div>
          </div>
        ) : (
          <MissionList missions={missions} cats={cats} onUpdate={fetchData} />
        )}
      </div>

      {showCreateForm && <MissionForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateForm(false)} />}
    </div>
  )
}
