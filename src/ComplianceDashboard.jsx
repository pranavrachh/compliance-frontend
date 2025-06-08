import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://compliance-backend-n8xg.onrender.com';

export default function ComplianceDashboard() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('pending');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    steps: [{ title: '' }],
    recipients: [],
    reminderDaysBefore: 1,
    reminderCount: 1,
  });
  const [reminderResult, setReminderResult] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks/status/${status}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const addTask = async () => {
    try {
      await axios.post(`${API_BASE}/tasks`, newTask);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        steps: [{ title: '' }],
        recipients: [],
        reminderDaysBefore: 1,
        reminderCount: 1,
      });
      fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const completeTask = async (id) => {
    try {
      await axios.put(`${API_BASE}/tasks/${id}/complete`);
      fetchTasks();
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  const sendReminders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks/reminders/send`);
      setReminderResult(`✅ Sent reminders for ${res.data.sent} task(s).`);
    } catch (err) {
      console.error('Error sending reminders:', err);
      setReminderResult('❌ Failed to send reminders.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [status]);

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setStatus('pending')}>Pending</button>
        <button onClick={() => setStatus('overdue')}>Overdue</button>
        <button onClick={() => setStatus('completed')}>Completed</button>
        <button onClick={sendReminders}>Send Reminders Now</button>
      </div>

      {reminderResult && (
        <div style={{ background: '#dcfce7', padding: '0.5rem', marginBottom: '1rem' }}>
          {reminderResult}
        </div>
      )}

      <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
        <h2>Add New Task</h2>
        <input placeholder="Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
        <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
        <input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
        <input placeholder="Step Title" value={newTask.steps[0].title} onChange={e => setNewTask({ ...newTask, steps: [{ title: e.target.value }] })} />
        <input placeholder="Reminder Days Before" type="number" value={newTask.reminderDaysBefore} onChange={e => setNewTask({ ...newTask, reminderDaysBefore: e.target.value })} />
        <input placeholder="Reminder Count" type="number" value={newTask.reminderCount} onChange={e => setNewTask({ ...newTask, reminderCount: e.target.value })} />
        <input placeholder="Recipient Emails/Numbers (comma-separated)" onChange={e => setNewTask({ ...newTask, recipients: e.target.value.split(',') })} />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {tasks.map(task => (
          <div key={task._id} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{task.title}</h3>
            <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>{task.description}</p>
            <ul>
              {task.steps?.map((step, i) => (
                <li key={i} style={{ textDecoration: step.completed ? 'line-through' : 'none' }}>
                  {step.title}
                </li>
              ))}
            </ul>
            <p><small>Reminders: {task.reminderCount} times, {task.reminderDaysBefore} day(s) before</small></p>
            <p><small>Recipients: {task.recipients?.join(', ')}</small></p>
            {!task.completed && <button onClick={() => completeTask(task._id)}>Mark Complete</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
