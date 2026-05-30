// src/components/AdminDashboard/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { FiTrash2, FiDownload, FiLogOut, FiAlertTriangle } from 'react-icons/fi';
import { getContacts, deleteContact, clearAllContacts, exportToCSV, getVisitorCount } from '../../utils/adminStorage';
import './AdminDashboard.css';

const ADMIN_PASSWORD = 'GopalMuri@Admin2026'; // ← CHANGE THIS before making repo public

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_authed') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [contacts, setContacts] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (authed) setContacts(getContacts());
  }, [authed]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authed', 'true');
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed');
    setAuthed(false);
    setPassword('');
  };

  const handleDelete = (id) => {
    deleteContact(id);
    setContacts(getContacts());
  };

  const handleClearAll = () => {
    if (confirmClear) {
      clearAllContacts();
      setContacts([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  // Login screen
  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login__card">
          <div className="admin-login__logo">⚙️</div>
          <h1 className="admin-login__title">Admin Portal</h1>
          <p className="admin-login__subtitle">Gopal Muri Portfolio</p>
          <form onSubmit={handleLogin} className="admin-login__form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="admin-login__input"
              autoFocus
            />
            {error && <p className="admin-login__error">{error}</p>}
            <button type="submit" className="admin-login__btn">Login →</button>
          </form>
        </div>
      </div>
    );
  }

  const visitorCount = getVisitorCount();

  return (
    <div className="admin">
      {/* Header */}
      <div className="admin__header">
        <div>
          <h1 className="admin__title">Admin Dashboard</h1>
          <p className="admin__subtitle">Gopal Muri Portfolio Management</p>
        </div>
        <button className="admin__logout" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Stats row */}
      <div className="admin__stats">
        <div className="admin__stat">
          <span className="admin__stat-label">Total Submissions</span>
          <span className="admin__stat-value">{contacts.length}</span>
        </div>
        <div className="admin__stat">
          <span className="admin__stat-label">Visitor Count</span>
          <span className="admin__stat-value">{visitorCount.toLocaleString()}</span>
        </div>
        <div className="admin__stat">
          <span className="admin__stat-label">Latest Submission</span>
          <span className="admin__stat-value">{contacts[0] ? formatDate(contacts[0].timestamp) : 'None'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="admin__actions">
        <button
          className="admin__action-btn admin__action-btn--export"
          onClick={() => exportToCSV(contacts)}
          disabled={contacts.length === 0}
        >
          <FiDownload /> Export CSV
        </button>
        <button
          className={`admin__action-btn admin__action-btn--clear ${confirmClear ? 'admin__action-btn--confirm' : ''}`}
          onClick={handleClearAll}
        >
          {confirmClear ? (
            <><FiAlertTriangle /> Confirm Clear All</>
          ) : (
            <><FiTrash2 /> Clear All</>
          )}
        </button>
        {confirmClear && (
          <button className="admin__action-btn" onClick={() => setConfirmClear(false)}>Cancel</button>
        )}
      </div>

      {/* Submissions table */}
      {contacts.length === 0 ? (
        <div className="admin__empty">
          <p>📭 No contact submissions yet.</p>
        </div>
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Time</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td><a href={`mailto:${c.email}`}>{c.email}</a></td>
                  <td>{c.subject}</td>
                  <td className="admin__msg-cell">{c.message}</td>
                  <td className="admin__time-cell">{formatDate(c.timestamp)}</td>
                  <td>
                    <button
                      className="admin__delete-btn"
                      onClick={() => handleDelete(c.id)}
                      aria-label="Delete submission"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
