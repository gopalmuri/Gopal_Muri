// src/utils/adminStorage.js
// Manages contact form submissions and visitor data in localStorage

const CONTACTS_KEY = 'portfolio_contacts';
const VISITOR_KEY = 'portfolio_visitor_count';

// ── CONTACTS ────────────────────────────────────────────────────

export const getContacts = () => {
  try {
    return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveContact = (data) => {
  const contacts = getContacts();
  const entry = {
    id: Date.now(),
    ...data,
    timestamp: new Date().toISOString(),
  };
  contacts.unshift(entry);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  return entry;
};

export const deleteContact = (id) => {
  const contacts = getContacts().filter((c) => c.id !== id);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
};

export const clearAllContacts = () => {
  localStorage.setItem(CONTACTS_KEY, '[]');
};

// ── VISITORS ─────────────────────────────────────────────────────

export const getVisitorCount = () => {
  return parseInt(localStorage.getItem(VISITOR_KEY) || '1200', 10);
};

// ── CSV EXPORT ───────────────────────────────────────────────────

export const exportToCSV = (contacts) => {
  const headers = ['ID', 'Name', 'Email', 'Subject', 'Message', 'Timestamp'];
  const rows = contacts.map((c) => [
    c.id,
    `"${c.name}"`,
    c.email,
    `"${c.subject}"`,
    `"${c.message?.replace(/"/g, '""')}"`,
    c.timestamp,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `contacts_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
