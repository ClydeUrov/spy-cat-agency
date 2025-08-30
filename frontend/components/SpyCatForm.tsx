"use client"

import type React from "react"

import { useState } from "react"
import type { SpyCatFormData } from "@/types"

interface SpyCatFormProps {
  onSubmit: (data: SpyCatFormData) => Promise<void>
  onCancel: () => void
}

export default function SpyCatForm({ onSubmit, onCancel }: SpyCatFormProps) {
  const [formData, setFormData] = useState<SpyCatFormData>({
    name: "",
    years_of_experience: 0,
    breed: "",
    salary: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await onSubmit(formData)
    } catch (err) {
      setError("Failed to create spy cat. Please check the breed name.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Spy Cat</h3>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter cat name"
              />
            </div>

            <div>
              <label htmlFor="years_of_experience" className="form-label">
                Years of Experience
              </label>
              <input
                type="number"
                id="years_of_experience"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                required
                min="0"
                className="form-input"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="breed" className="form-label">
                Breed
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g., Persian, Siamese, Maine Coon"
              />
              <p className="mt-1 text-xs text-gray-500">Must be a valid breed from TheCatAPI</p>
            </div>

            <div>
              <label htmlFor="salary" className="form-label">
                Salary ($)
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="form-input"
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create Spy Cat"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
