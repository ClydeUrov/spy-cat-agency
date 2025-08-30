"use client"

import type React from "react"

import { useState } from "react"
import { missionApi, type MissionCreate, type TargetCreate } from "@/lib/api"

interface MissionFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function MissionForm({ onSuccess, onCancel }: MissionFormProps) {
  const [targets, setTargets] = useState<TargetCreate[]>([{ name: "", country: "", notes: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addTarget = () => {
    setTargets([...targets, { name: "", country: "", notes: "" }])
  }

  const removeTarget = (index: number) => {
    if (targets.length > 1) {
      setTargets(targets.filter((_, i) => i !== index))
    }
  }

  const updateTarget = (index: number, field: keyof TargetCreate, value: string) => {
    const updatedTargets = targets.map((target, i) => (i === index ? { ...target, [field]: value } : target))
    setTargets(updatedTargets)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Validate targets
    const validTargets = targets.filter((target) => target.name.trim() && target.country.trim())

    if (validTargets.length === 0) {
      setError("At least one target with name and country is required")
      setIsSubmitting(false)
      return
    }

    try {
      const missionData: MissionCreate = {
        targets: validTargets,
      }

      await missionApi.create(missionData)
      onSuccess()
    } catch (error: any) {
      setError(error.message || "Failed to create mission")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Mission</h2>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Mission Targets</h3>

              {targets.map((target, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Target {index + 1}</h4>
                    {targets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTarget(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={target.name}
                        onChange={(e) => updateTarget(index, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                      <input
                        type="text"
                        value={target.country}
                        onChange={(e) => updateTarget(index, "country", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={target.notes}
                      onChange={(e) => updateTarget(index, "notes", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addTarget}
                className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                + Add Another Target
              </button>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Creating..." : "Create Mission"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
