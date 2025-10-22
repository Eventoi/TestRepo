import React, { useState } from 'react';
import { apiFetch } from '../../api/api';

// Компонент загрузки файла с комментарием.
// Использует multipart/form-data

export default function FileUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError('Выберите файл');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    form.append('comment', comment);

    try {
      setLoading(true);
      await apiFetch('/storage/files/', { method: 'POST', body: form });
      setFile(null);
      setComment('');
      if (onUploaded) onUploaded();
    } catch (err) {
      setError(err.payload || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <h3>Загрузить файл</h3>
      <form onSubmit={submit}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <div>
          <input placeholder="Комментарий (опционально)" value={comment} onChange={e => setComment(e.target.value)} />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>{loading ? 'Загрузка...' : 'Загрузить'}</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 6 }}>{JSON.stringify(error)}</div>}
      </form>
    </div>
  );
}