import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PrivateRoute from '../components/PrivateRoute';
import FileList from '../features/storage/FileList';
import FileUpload from '../features/storage/FileUpload';
import { apiFetch } from '../api/api';

// Страница управления файловым хранилищем.
// Если админ, можно указать query param user_id (реализовано на бекенде),
// но здесь мы показываем текущее хранилище и админ может переключать параметр

export default function StoragePage() {
  const user = useSelector(s => s.auth.user);
  const [files, setFiles] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchFiles();
  }, [user, selectedUserId]);

  async function fetchFiles() {
    try {
      let url = '/storage/files/';
      if (user.is_administrator && selectedUserId) {
        url += `?user_id=${selectedUserId}`;
      }
      const data = await apiFetch(url);
      setFiles(data);
    } catch (err) {
      setError(err.payload || err.message);
    }
  }

  return (
    <PrivateRoute>
      <div>
        <h2>Моё хранилище</h2>
        {user && user.is_administrator && (
          <div style={{ marginBottom: 12 }}>
            <label>Показать хранилище пользователя (введите user_id и нажмите Fetch): </label>
            <input value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} />
            <button onClick={fetchFiles} style={{ marginLeft: 8 }}>Fetch</button>
            <button onClick={() => { setSelectedUserId(''); fetchFiles(); }} style={{ marginLeft: 8 }}>Показать своё</button>
          </div>
        )}

        <FileUpload onUploaded={() => fetchFiles()} />
        <FileList files={files} onChange={() => fetchFiles()} />
        {error && <div style={{ color: 'red' }}>{JSON.stringify(error)}</div>}
      </div>
    </PrivateRoute>
  );
}