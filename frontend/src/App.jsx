import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import TaskLists from './components/TaskLists'
import AddTask from './components/Addtask'
import { PlusCircle, Moon } from 'lucide-react'
import axios from 'axios'
import Register from "./components/Register";
import Login from "./components/Login";
import './App.css'

const base_url = import.meta.env.VITE_BASE_URL;

function App() {
  const [tasks, setTasks] = useState([])
  const [username, setUsername] = useState("");

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const response = await axios.get(`${base_url}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }, 
      });

      setTasks(response.data.tasks);
    } catch (err) {
      console.log("Error in fetching tasks", err);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const response = await axios.get(`${base_url}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setUsername(response.data.user.name);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUserData();
  }, [localStorage.getItem("token")]);

  const addTask = async (taskText) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
  
      const response = await axios.post(`${base_url}/api/tasks`, 
        { text: taskText }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setTasks([...tasks, response.data.task]); 
    } catch (err) {
      console.log("Error adding tasks", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
  
      await axios.delete(`${base_url}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
  
      const taskToToggle = tasks.find((task) => task._id === taskId);
  
      const response = await axios.put(
        `${base_url}/api/tasks/${taskId}`,
        { completed: !taskToToggle.completed }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, completed: response.data.task.completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <div className="app-header">
          <h1 className="app-title">TaskVault</h1>
          <div className="theme-icon">
            <Moon />
          </div>
        </div>
        
        <Routes>
          <Route 
            path="/" 
            element={
              <TaskLists 
                tasks={tasks} 
                toggleTask={toggleTask} 
                deleteTask={deleteTask} 
                username={username}
              />
            } 
          />
          <Route 
            path="/add-task" 
            element={
              <AddTask addTask={addTask} />
            } 
          />
           <Route path="/register" element={<Register />} />
           <Route path="/login" element={<Login />} />
        </Routes>
        
        <Link to="/add-task" className="add-task-button">
          <PlusCircle className="add-icon" />
        </Link>
      </div>
    </Router>
  )
}

export default App