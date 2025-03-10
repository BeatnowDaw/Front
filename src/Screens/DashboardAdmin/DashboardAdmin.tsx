import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../Layout/Header/Header";
import LeftSlide from "../../Layout/LeftSlide/LeftSlide";
import "./DashboardAdmin.css";
import CardDetails from "../../components/CardDetails/CardDetails";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  password?: string;
}

const DashboardAdmin = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({ _id: '', username: '', email: '', role: 'user', password: '' });

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      console.error("No token found, authentication required.");
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (_id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(user => user._id !== _id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;
    try {
      const { password, ...userData } = editingUser;
      const response = await fetch(`http://127.0.0.1:5000/api/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Failed to update user');
      setUsers(users.map(user => (user._id === editingUser._id ? editingUser : user)));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error('Failed to add user');
      const createdUser: User = await response.json();
      setUsers([...users, createdUser]);
      setNewUser({ _id: '', username: '', email: '', role: 'user', password: '' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="leftSlide">
        <LeftSlide />
      </div>
      <div className="content">
        <h2>Admin Dashboard</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => setEditingUser(user)}>Edit</button>
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingUser && (
          <div>
            <br />
            <h3>Edit User</h3>
            <br />
            <input type="text" value={editingUser.username} onChange={e => setEditingUser({ ...editingUser, username: e.target.value })} />
            <br />
            <input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} />
            <br />
            <input type="password" placeholder="New Password" onChange={e => setEditingUser({ ...editingUser, password: e.target.value })} />
            <br />
            <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <br />
            <button onClick={updateUser}>Save</button>
            <br />
          </div>
        )}

        <div>
        <br />
          <h3>Add User</h3>
          <br />
          <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
          <br />
          <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
          <br />
          <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
          <br />
          <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <br />
          <button onClick={addUser}>Add</button>
          <br />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
