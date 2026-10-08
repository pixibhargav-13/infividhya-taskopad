import React, { useEffect ,useState } from "react";
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


import API from "./api/api"; // Import the API instance for making requests

const INITIAL_USERS = [
  { _id: "u1", firstName: "Alex", lastName: "Morgan", email: "alex@company.com" },
  { _id: "u2", firstName: "Sam", lastName: "Chen", email: "sam@company.com" },
  { _id: "u3", firstName: "Priya", lastName: "Patel", email: "priya@company.com" },
  { _id: "u4", firstName: "Jordan", lastName: "Lee", email: "jordan@company.com" }
];

const LOGGED_IN_USER = INITIAL_USERS[0];

// Fixed status strings to perfectly match Mongoose Model schemas ("Pending", "In Progress", "Completed")
const INITIAL_TASKS = [
  { 
    _id: "t1", 
    title: "Redesign onboarding flow", 
    description: "Revamp signup steps to prioritize clear structural flows.", 
    createdBy: LOGGED_IN_USER, 
    assignedTo: INITIAL_USERS[0], 
    status: "Pending", 
    priority: "High", 
    dueDate: "2026-07-10" 
  },
  { 
    _id: "t2", 
    title: "Fix payment gateway bug", 
    description: "Resolve intermittent 500 exceptions triggered during webhooks.", 
    createdBy: LOGGED_IN_USER, 
    assignedTo: INITIAL_USERS[1], 
    status: "Pending", 
    priority: "High", 
    dueDate: "2026-07-05" 
  },
  { 
    _id: "t3", 
    title: "Write API documentation", 
    description: "Generate markdown docs detailing authorization middleware flows.", 
    createdBy: LOGGED_IN_USER, 
    assignedTo: INITIAL_USERS[2], 
    status: "In Progress", // Maps correctly to Column 'In Progress' (In Review)
    priority: "Medium", 
    dueDate: "2026-07-15" 
  },
  { 
    _id: "t4", 
    title: "Update dashboard analytics", 
    description: "Integrate live charting tools evaluating historical metrics.", 
    createdBy: LOGGED_IN_USER, 
    assignedTo: INITIAL_USERS[3], 
    status: "In Progress", // Maps correctly to Column 'In Progress' (In Review)
    priority: "Medium", 
    dueDate: "2026-07-12" 
  },
  { 
    _id: "t5", 
    title: "Set up CI/CD pipeline", 
    description: "Configure workflows to perform lint checks and container builds.", 
    createdBy: LOGGED_IN_USER, 
    assignedTo: INITIAL_USERS[1], 
    status: "Completed", // Maps correctly to Column 'Completed'
    priority: "Low", 
    dueDate: "2026-06-28" 
  },
  { 
    _id: "t6", 
    title: "Create component library", 
    description: "Publish unified atomic assets maintaining standard tokens.", 
    createdBy: LOGGED_IN_USER, 
    assignedTo: INITIAL_USERS[0], 
    status: "Completed", // Maps correctly to Column 'Completed'
    priority: "Low", 
    dueDate: "2026-06-25" 
  }
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);
  const [users , setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token")); 
  const [leave, setLeave] = useState([]);
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

const currentUser = savedUser
    ? JSON.parse(savedUser)
    : null;

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

        console.log("Full backend response:", response.data);
        console.log("Tasks:", response.data?.data);

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

    console.log("Users from backend:", response.data);

    setUsers(response.data.data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};



useEffect(() => {
    fetchTasks();
    fetchUsers();
 
}, []);

const handleSaveTask = async (savedTask) => {
  try
  {
    const response = await API.post("/task", {
            title: savedTask.title,
      description: savedTask.description,
      assignedTo: savedTask.assignedTo,
      priority: savedTask.priority,
      dueDate: savedTask.dueDate
    });
    setTasks(prev => [...prev, response.data.data]);
    setShowModal(false);
       setTaskToEdit(null);
    console.log("Task saved successfully:", response.data);
  }
  catch (error) {
    console.error("Error saving task:", error);
  }
    // setTasks(prev => {
    //     const exists = prev.some(t => t._id === savedTask._id);

    //     if (exists) {
    //         return prev.map(t =>
    //             t._id === savedTask._id ? savedTask : t
    //         );
    //     }

    //     return [...prev, savedTask];
    // });

    // setShowModal(false);
    // setTaskToEdit(null);
};
  return (
    <Router>
      <Routes>
        {/* Isolated Authentication Page Routes Layout */}
        <Route path="/login" element={<Login onAuthSuccess={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={<Register />} />

        {/* Global Protected System Route Layout Wrapper */}
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
          onClose={() => { setShowModal(false); setTaskToEdit(null); }} 
          onSave={handleSaveTask} 
        />
      )}
    </Router>
  );
}