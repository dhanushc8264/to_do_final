import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, X } from 'lucide-react'
import '../styles/Addtask.css'

function AddTask({ addTask }) {
  const [task, setTask] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (task.trim() === "") {
      setError("Please enter a task")
      return
    }
    await addTask(task)
    setTask("")
    setError("")
    navigate('/')
  }

  return (
    <div className="add-task-page">
      <div className="add-task-container">
        <div className="form-header">
          <button 
            onClick={() => navigate('/')} 
            className="back-button"
            aria-label="Go back"
          >
            <ArrowLeft className="back-icon" />
          </button>
          <h2 className="form-title">Create New Task</h2>
        </div>
        
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What needs to be done?"
              className="task-input"
            />
            {task && (
              <button 
                type="button" 
                className="clear-input" 
                onClick={() => setTask("")}
                aria-label="Clear input"
              >
                <X className="clear-icon" />
              </button>
            )}
            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>
          
          <div className="form-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
            >
              <Plus className="submit-icon" />
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTask