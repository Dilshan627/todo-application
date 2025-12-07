import React, { useState, useEffect } from 'react';
import { CheckCircle, Plus, X } from 'lucide-react';
import { loadTasks, createTask, completeTask, checkBackendConnection } from '../services/api';
import './MainView.css';

export default function MainView() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      const result = await checkBackendConnection();
      console.log('Backend Status:', result);
      setBackendStatus(result);
    };
    testConnection();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setLoading(true);
    const result = await createTask(title, description, tasks);
    
    if (result.success) {
      setTasks(result.tasks);
      setTitle('');
      setDescription('');
      setShowForm(false);
    } else {
      alert(result.error || 'Failed to create task');
    }
    setLoading(false);
  };

  const markAsComplete = async (id) => {
    setLoading(true);
    const result = await completeTask(id, tasks);
    
    if (result.success) {
      setTasks(result.tasks);
    } else {
      alert('Failed to complete task');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="header">
          <h1>My Tasks</h1>
          {backendStatus && (
            <p style={{ fontSize: '0.75rem', color: backendStatus.connected ? '#16a34a' : '#dc2626' }}>
              {backendStatus.connected ? 'Backend Connected' : 'Using Local Storage'}
            </p>
          )}
        </div>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="add-task-btn"
            disabled={loading}
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>
        ) : (
          <div className="form-card">
            <div className="form-header">
              <h2>New Task</h2>
              <button
                onClick={() => setShowForm(false)}
                className="close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <div className="form-group">
                <label className="form-label">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="form-input"
                  placeholder="Enter task title"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                  placeholder="Enter task description (optional)"
                  disabled={loading}
                />
              </div>
              <div className="form-actions">
                <button
                  onClick={handleSubmit}
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="tasks-list">
          {loading && tasks.length === 0 ? (
            <div className="empty-state">
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <CheckCircle className="w-16 h-16" />
              </div>
              <p>No tasks yet</p>
              <p>Create your first task to get started</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h3 className="task-title">
                    {task.title}
                  </h3>
                  <button
                    onClick={() => markAsComplete(task.id)}
                    className="done-btn"
                    disabled={loading}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Done
                  </button>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <p className="task-meta">
                  Created: {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {tasks.length > 0 && (
          <p className="footer-text">
            Showing {tasks.length} of your most recent tasks
          </p>
        )}
      </div>
    </div>
  );
}