"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import { getWorkouts, createWorkout } from "./services/workoutService"
import { getRoutines, createRoutine } from "./services/routineService"
import LoadingSpinner from "./components/LoadingSpinner"
import "./globals.css"

export default function Home() {
  const [workouts, setWorkouts] = useState([])
  const [routines, setRoutines] = useState([])
  const [workoutName, setWorkoutName] = useState("")
  const [workoutDescription, setWorkoutDescription] = useState("")
  const [routineName, setRoutineName] = useState("")
  const [routineDescription, setRoutineDescription] = useState("")
  const [selectedWorkouts, setSelectedWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [workoutsData, routinesData] = await Promise.all([getWorkouts(), getRoutines()])
        setWorkouts(workoutsData)
        setRoutines(routinesData)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateWorkout = async (e) => {
    e.preventDefault()
    try {
      const newWorkout = await createWorkout({
        name: workoutName,
        description: workoutDescription,
      })
      setWorkouts([...workouts, newWorkout])
      setWorkoutName("")
      setWorkoutDescription("")
      // Show success message
    } catch (err) {
      console.error("Failed to create workout:", err)
      setError("Failed to create workout. Please try again.")
    }
  }

  const handleCreateRoutine = async (e) => {
    e.preventDefault()
    try {
      const newRoutine = await createRoutine({
        name: routineName,
        description: routineDescription,
        workouts: selectedWorkouts,
      })
      setRoutines([...routines, newRoutine])
      setRoutineName("")
      setRoutineDescription("")
      setSelectedWorkouts([])
      // Show success message
    } catch (err) {
      console.error("Failed to create routine:", err)
      setError("Failed to create routine. Please try again.")
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">Dashboard</h1>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Create Workout</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleCreateWorkout}>
                  <div className="mb-3">
                    <label htmlFor="workoutName" className="form-label">
                      Workout Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutName"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutDescription" className="form-label">
                      Workout Description
                    </label>
                    <textarea
                      className="form-control"
                      id="workoutDescription"
                     
                      value={workoutDescription}
                      onChange={(e) => setWorkoutDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Create Workout
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Create Routine</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleCreateRoutine}>
                  <div className="mb-3">
                    <label htmlFor="routineName" className="form-label">
                      Routine Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineName"
                      value={routineName}
                      onChange={(e) => setRoutineName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="routineDescription" className="form-label">
                      Routine Description
                    </label>
                    <textarea
                      className="form-control"
                      id="routineDescription"
                     
                      value={routineDescription}
                      onChange={(e) => setRoutineDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutSelect" className="form-label">
                      Select Workouts
                    </label>
                    <select
                      multiple
                      className="form-select"
                      id="workoutSelect"
                      value={selectedWorkouts}
                      onChange={(e) => setSelectedWorkouts([...e.target.selectedOptions].map((option) => option.value))}
                      style={{ height: "150px" }}
                    >
                      {workouts.map((workout) => (
                        <option key={workout.id} value={workout.id}>
                          {workout.name}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">Hold Ctrl (or Cmd) to select multiple workouts</div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Create Routine
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Your Routines</h2>
            {routines.length === 0 ? (
              <div className="alert alert-info">You don't have any routines yet. Create one above!</div>
            ) : (
              <div className="row">
                {routines.map((routine) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={routine.id}>
                    <div className="card h-100">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">{routine.name}</h5>
                      </div>
                      <div className="card-body">
                        <p className="card-text">{routine.description}</p>
                        <h6 className="mt-3 mb-2">Workouts:</h6>
                        {routine.workouts && routine.workouts.length > 0 ? (
                          <ul className="list-group">
                            {routine.workouts.map((workout) => (
                              <li className="list-group-item" key={workout.id}>
                                <strong>{workout.name}</strong>: {workout.description}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted">No workouts in this routine</p>
                        )}
                      </div>
                      <div className="card-footer d-flex justify-content-end">
                        <button className="btn btn-outline-primary btn-sm me-2">Edit</button>
                        <button className="btn btn-outline-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h2 className="mb-4">Your Workouts</h2>
            {workouts.length === 0 ? (
              <div className="alert alert-info">You don't have any workouts yet. Create one above!</div>
            ) : (
              <div className="row">
                {workouts.map((workout) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={workout.id}>
                    <div className="card h-100">
                      <div className="card-header bg-secondary text-white">
                        <h5 className="mb-0">{workout.name}</h5>
                      </div>
                      <div className="card-body">
                        <p className="card-text">{workout.description}</p>
                      </div>
                      <div className="card-footer d-flex justify-content-end">
                        <button className="btn btn-outline-secondary btn-sm me-2">Edit</button>
                        <button className="btn btn-outline-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

