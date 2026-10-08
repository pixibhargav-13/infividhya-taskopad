import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Board from "./components/Board";
import TaskModal from "./components/TaskModal";

import Dashboard from "./views/Dashboard";
import Team from "./views/Team";
import Holidays from "./views/Holidays";
import Settings from "./views/Settings";
import Login from "./views/Login";
import Register from "./views/Register";
import Leaves from "./views/Leaves";

import API from "./api/api";

const INITIAL_USERS = [
  { _id: "u1", firstName: "Alex", lastName: "Morgan", email: "alex@company.com" },
  { _id: "u2", firstName: "Sam", lastName: "Chen", email: "sam@company.com" },
  { _id: "u3", firstName: "Priya", lastName: "Patel", email: "priya@company.com" },
  { _id: "u4", firstName: "Jordan", lastName: "Lee", email: "jordan@company.com" }
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setShowModal(true);
  };

  const savedUser = localStorage.getItem("user");
  let currentUser = null;
  try {
    const parsed = savedUser ? JSON.parse(savedUser) : null;
    currentUser = parsed?.user || parsed;
  } catch {
    currentUser = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  const fetchTasks = async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const response = await API.get("/task", { timeout: 15000 });
      setTasks(response.data?.data || []);
      setTasksError(null);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasksError("Can't fetch Tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get("/auth/user");
      if (response.data?.data) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchTasks();
    fetchUsers();
  }, [isAuthenticated]);

  const handleSaveTask = async (savedTask) => {
    try {
      const response = await API.post("/task", {
        title: savedTask.title,
        description: savedTask.description,
        assignedTo: savedTask.assignedTo,
        priority: savedTask.priority,
        dueDate: savedTask.dueDate,
      });
      setTasks((prev) => [...prev, response.data.data]);
      setShowModal(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Authentication Pages */}
        <Route path="/login" element={<Login onAuthSuccess={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={<Register />} />

        {/* Global Protected System Layout */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className="app-layout-wrapper">
                <Sidebar
                  onOpenNewTask={handleOpenCreateModal}
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                />

                <div className="app-main-viewport">
                  <TopBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentUser={currentUser}
                    onLogout={handleLogout}
                    onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                  />

                  <main className="app-main-content">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route
                        path="/tasks"
                        element={
                          <Board
                            tasks={tasks}
                            setTasks={setTasks}
                            searchQuery={searchQuery}
                            onAddTask={handleOpenCreateModal}
                            onEditTask={handleOpenEditModal}
                            isLoading={tasksLoading}
                            error={tasksError}
                            onRetry={fetchTasks}
                          />
                        }
                      />
                      <Route path="/leaves" element={<Leaves />} />
                      <Route path="/team" element={<Team users={users} />} />
                      <Route path="/holidays" element={<Holidays />} />
                      <Route path="/calendar" element={<Navigate to="/holidays" replace />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {showModal && (
        <TaskModal
          users={users}
          taskToEdit={taskToEdit}
          currentUser={currentUser}
          onClose={() => {
            setShowModal(false);
            setTaskToEdit(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </Router>
  );
}