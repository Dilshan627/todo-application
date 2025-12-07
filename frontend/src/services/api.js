const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TIMEOUT = import.meta.env.VITE_TIMEOUT || 10000;

const STORAGE_KEY = 'demo-tasks';
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';

const apiRequest = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('API request timeout');
      throw new Error('Request timeout');
    }
    
    console.error('API request failed:', error);
    throw error;
  }
};


const loadTasksLocal = async () => {
  try {
    const result = await window.storage.get(STORAGE_KEY);
    if (result && result.value) {
      return JSON.parse(result.value);
    }
    return [];
  } catch (error) {
    console.error('Error loading tasks from local storage:', error);
    return [];
  }
};

const saveTasksLocal = async (tasks) => {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Error saving tasks to local storage:', error);
    return false;
  }
};


export const loadTasks = async () => {
  if (!USE_BACKEND) {
    console.log('Using local storage (backend disabled)');
    return loadTasksLocal();
  }

  try {
    console.log('Fetching tasks from backend...');
    const tasks = await apiRequest('/tasks', {
      method: 'GET',
    });
    console.log('Tasks loaded successfully:', tasks);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error('Failed to load tasks from backend, using local storage fallback');
    return loadTasksLocal();
  }
};

export const createTask = async (title, description, existingTasks = []) => {
  if (!title || !title.trim()) {
    return { success: false, error: 'Title is required' };
  }

  const taskData = {
    title: title.trim(),
    description: description.trim(),
  };

  if (!USE_BACKEND) {
    console.log('Creating task locally...');
    const newTask = {
      id: Date.now(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [newTask, ...existingTasks].slice(0, 5);
    const saved = await saveTasksLocal(updatedTasks);

    return {
      success: saved,
      task: newTask,
      tasks: updatedTasks
    };
  }

  try {
    console.log('Creating task on backend:', taskData);
    const createdTask = await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });

    console.log('Task created successfully:', createdTask);

    const tasks = await loadTasks();

    return {
      success: true,
      task: createdTask,
      tasks: tasks
    };
  } catch (error) {
    console.error('Failed to create task on backend:', error);
    return { success: false, error: error.message || 'Failed to create task' };
  }
};


export const getTaskById = async (taskId) => {
  if (!USE_BACKEND) {
    const tasks = await loadTasksLocal();
    return tasks.find(task => task.id === taskId) || null;
  }

  try {
    console.log(`Fetching task ${taskId} from backend...`);
    const task = await apiRequest(`/tasks/${taskId}`, {
      method: 'GET',
    });
    return task;
  } catch (error) {
    console.error(`Failed to fetch task ${taskId}:`, error);
    return null;
  }
};

export const completeTask = async (taskId, existingTasks = []) => {
  if (!USE_BACKEND) {
    console.log('Completing task locally...');
    const updatedTasks = existingTasks.filter(task => task.id !== taskId);
    const saved = await saveTasksLocal(updatedTasks);

    return {
      success: saved,
      tasks: updatedTasks
    };
  }

  try {
    console.log(`Marking task ${taskId} as complete on backend...`);
    const completedTask = await apiRequest(`/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });

    console.log('Task completed successfully:', completedTask);

    const tasks = await loadTasks();

    return {
      success: true,
      task: completedTask,
      tasks: tasks
    };
  } catch (error) {
    console.error('Failed to complete task on backend:', error);
    return { success: false, error: error.message || 'Failed to complete task' };
  }
};

export const deleteTask = async (taskId, existingTasks = []) => {
  if (!USE_BACKEND) {
    console.log('Deleting task locally...');
    const updatedTasks = existingTasks.filter(task => task.id !== taskId);
    const saved = await saveTasksLocal(updatedTasks);

    return {
      success: saved,
      tasks: updatedTasks
    };
  }

  try {
    console.log(`Deleting task ${taskId} from backend...`);
    await apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });

    console.log('Task deleted successfully');

    const tasks = await loadTasks();

    return {
      success: true,
      tasks: tasks
    };
  } catch (error) {
    console.error('Failed to delete task on backend:', error);
    return { success: false, error: error.message || 'Failed to delete task' };
  }
};

export const updateTask = async (taskId, updates, existingTasks = []) => {
  if (!USE_BACKEND) {
    console.log('Updating task locally...');
    const updatedTasks = existingTasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );

    const saved = await saveTasksLocal(updatedTasks);

    return {
      success: saved,
      tasks: updatedTasks
    };
  }

  console.warn('Update endpoint not implemented in backend. Consider adding PUT /api/tasks/:id');
  
  return { 
    success: false, 
    error: 'Update endpoint not available. Use complete or delete instead.' 
  };
};

export const clearAllTasks = async () => {
  if (!USE_BACKEND) {
    try {
      await window.storage.delete(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing tasks:', error);
      return false;
    }
  }

  console.warn('Clear all tasks endpoint not implemented in backend');
  return false;
};

export const apiConfig = {
  baseUrl: API_BASE_URL,
  useBackend: USE_BACKEND,
  timeout: TIMEOUT,
};

export const checkBackendConnection = async () => {
  try {
    await apiRequest('/tasks', { method: 'GET' });
    return { connected: true, message: 'Backend connected successfully' };
  } catch (error) {
    return { connected: false, message: error.message };
  }
};