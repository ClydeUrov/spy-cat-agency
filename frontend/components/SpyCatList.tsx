"use client"

import type React from "react"

import { useState } from "react"
import type { SpyCat } from "@/types"

interface SpyCatListProps {
  cats: SpyCat[]
  onEdit: (cat: SpyCat) => void
  onDelete: (id: number) => void
  editingCat: SpyCat | null
  onUpdateCat: (id: number, salary: number) => Promise<void>
  onCancelEdit: () => void
}

export default function SpyCatList({ cats, onEdit, onDelete, editingCat, onUpdateCat, onCancelEdit }: SpyCatListProps) {
  const [editSalary, setEditSalary] = useState<number>(0)
  const [updating, setUpdating] = useState(false)

  const handleEditClick = (cat: SpyCat) => {
    setEditSalary(cat.salary)
    onEdit(cat)
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCat) return

    setUpdating(true)
    try {
      await onUpdateCat(editingCat.id, editSalary)
    } catch (err) {
      // Error handling is done in parent component
    } finally {
      setUpdating(false)
    }
  }

  if (cats.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No spy cats</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding your first spy cat to the agency.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">Active Spy Cats ({cats.length})</h3>
      </div>
      <div className="card-body p-0">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Breed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cats.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cat.breed}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cat.years_of_experience} years</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingCat?.id === cat.id ? (
                      <form onSubmit={handleUpdateSubmit} className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editSalary}
                          onChange={(e) => setEditSalary(Number(e.target.value))}
                          min="0"
                          step="0.01"
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                          disabled={updating}
                        />
                        <button
                          type="submit"
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          disabled={updating}
                        >
                          {updating ? "..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={onCancelEdit}
                          className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                          disabled={updating}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div className="text-sm text-gray-900">${cat.salary.toLocaleString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {editingCat?.id !== cat.id && (
                        <>
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Edit Salary
                          </button>
                          <button onClick={() => onDelete(cat.id)} className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
