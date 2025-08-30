"use client"

import { useState } from "react"
import { missionApi, targetApi, type Mission, type SpyCat, type TargetUpdate } from "@/lib/api"

interface MissionListProps {
  missions: Mission[]
  cats: SpyCat[]
  onUpdate: () => void
}

export default function MissionList({ missions, cats, onUpdate }: MissionListProps) {
  const [expandedMission, setExpandedMission] = useState<number | null>(null)
  const [assigningMission, setAssigningMission] = useState<number | null>(null)
  const [updatingTarget, setUpdatingTarget] = useState<number | null>(null)
  const [targetNotes, setTargetNotes] = useState<string>("")

  const handleDeleteMission = async (missionId: number) => {
    if (!confirm("Are you sure you want to delete this mission?")) return

    try {
      await missionApi.delete(missionId)
      onUpdate()
    } catch (error: any) {
      alert(error.message || "Failed to delete mission")
    }
  }

  const handleAssignCat = async (missionId: number, catId: number) => {
    try {
      await missionApi.assign(missionId, { cat_id: catId })
      setAssigningMission(null)
      onUpdate()
    } catch (error: any) {
      alert(error.message || "Failed to assign cat to mission")
    }
  }

  const handleUpdateTarget = async (targetId: number, update: TargetUpdate) => {
    try {
      await targetApi.update(targetId, update)
      setUpdatingTarget(null)
      setTargetNotes("")
      onUpdate()
    } catch (error: any) {
      alert(error.message || "Failed to update target")
    }
  }

  const getAssignedCat = (catId: number | null) => {
    if (!catId) return null
    return cats.find((cat) => cat.id === catId)
  }

  const getAvailableCats = () => {
    const assignedCatIds = missions.filter((m) => m.cat_id && !m.complete).map((m) => m.cat_id)
    return cats.filter((cat) => !assignedCatIds.includes(cat.id))
  }

  return (
    <div className="space-y-4">
      {missions.map((mission) => {
        const assignedCat = getAssignedCat(mission.cat_id)
        const isExpanded = expandedMission === mission.id
        const completedTargets = mission.targets.filter((t) => t.complete).length
        const totalTargets = mission.targets.length

        return (
          <div key={mission.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-gray-900">Mission #{mission.id}</h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        mission.complete ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {mission.complete ? "Complete" : "In Progress"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {completedTargets}/{totalTargets} targets complete
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedMission(isExpanded ? null : mission.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {isExpanded ? "Hide Details" : "Show Details"}
                  </button>

                  {!mission.cat_id && (
                    <button
                      onClick={() => handleDeleteMission(mission.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2">
                {assignedCat ? (
                  <p className="text-sm text-gray-600">
                    Assigned to: <span className="font-medium">{assignedCat.name}</span>
                  </p>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Unassigned</span>
                    {assigningMission === mission.id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          onChange={(e) => handleAssignCat(mission.id, Number.parseInt(e.target.value))}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Select a cat...</option>
                          {getAvailableCats().map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name} ({cat.breed})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setAssigningMission(null)}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAssigningMission(mission.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Assign Cat
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-200 p-4">
                <h4 className="font-medium text-gray-900 mb-3">Targets</h4>
                <div className="space-y-3">
                  {mission.targets.map((target) => (
                    <div key={target.id} className="border border-gray-100 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-medium text-gray-800">{target.name}</h5>
                            <span className="text-sm text-gray-500">({target.country})</span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                target.complete ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {target.complete ? "Complete" : "Pending"}
                            </span>
                          </div>

                          {updatingTarget === target.id ? (
                            <div className="mt-2 space-y-2">
                              <textarea
                                value={targetNotes}
                                onChange={(e) => setTargetNotes(e.target.value)}
                                placeholder="Update notes..."
                                rows={2}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleUpdateTarget(target.id, { notes: targetNotes })}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                  Save Notes
                                </button>
                                <button
                                  onClick={() => {
                                    setUpdatingTarget(null)
                                    setTargetNotes("")
                                  }}
                                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>{target.notes && <p className="text-sm text-gray-600 mt-1">{target.notes}</p>}</>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {!target.complete && !mission.complete && updatingTarget !== target.id && (
                            <>
                              <button
                                onClick={() => {
                                  setUpdatingTarget(target.id)
                                  setTargetNotes(target.notes)
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Edit Notes
                              </button>
                              <button
                                onClick={() => handleUpdateTarget(target.id, { complete: true })}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Mark Complete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
