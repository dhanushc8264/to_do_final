import React from 'react'
import { Trash2, CheckCircle, Circle, Clock } from 'lucide-react'
import '../styles/TaskLists.css'

function TaskLists({ tasks, toggleTask, deleteTask, username = "User" }) {
  // Sort tasks: incomplete first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  if (tasks.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-illustration">
          <div className="empty-circle"></div>
          <div className="empty-line"></div>
          <div className="empty-line"></div>
          <div className="empty-line"></div>
        </div>
        <h2 className="empty-title">No tasks yet</h2>
        <p className="empty-subtitle">Your task list is empty. Add your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="task-list-container">
      <div className="welcome-section">
        <div className="greeting-container">
          <h2 className="greeting">Hello, <span className="username">{username}</span></h2>
          <p className="status-message">
            {sortedTasks.filter(task => !task.completed).length > 0 
              ? `You have ${sortedTasks.filter(task => !task.completed).length} tasks pending` 
              : 'All tasks completed! 🎉'}
          </p>
        </div>
        <div className="task-stats">
          <div className="stat-item">
            <span className="stat-count">{sortedTasks.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-count">{sortedTasks.filter(task => !task.completed).length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-count">{sortedTasks.filter(task => task.completed).length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <ul className="task-list">
        {sortedTasks.map((task, index) => (
          <li
            key={task._id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <button
              onClick={() => toggleTask(task._id)}
              className={`toggle-button ${task.completed ? 'completed-toggle' : ''}`}
            >
              {task.completed ? (
                <CheckCircle className="check-icon completed" />
              ) : (
                <Clock className="check-icon" />
              )}
            </button>
            <div className="task-content">
              <span className="task-text">{task.text}</span>
              <div className="task-progress">
                <div className="progress-bar">
                  <div className="progress" style={{ width: task.completed ? '100%' : '0%' }}></div>
                </div>
                <span className="task-status">{task.completed ? 'Completed' : 'In Progress'}</span>
              </div>
            </div>
            <button
              onClick={() => deleteTask(task._id)}
              className="delete-button"
              aria-label="Delete task"
            >
              <Trash2 className="delete-icon" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskLists