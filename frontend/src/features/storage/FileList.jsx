import React, { useState } from 'react';
import { apiFetch } from '../../api/api';

// Компонент списка файлов. Для каждого файла доступны:
// - скачать (через API authorized)
// - удалить
// - переименовать (изменить original_name)
// - изменить комментарий
// - получить публичную ссылку

export default function FileList({ files = [], onChange }) {
  const [editing, setEditing] = useState(null); // id редактируемого файла
  const [editName, setEditName] = useState('');
  const [editComment, setEditComment] = useState('');
  const [msg, setMsg] = useState('');

  async function download(id) {
    try {
      // скачивание через endpoint /storage/files/<id>/download/
      const res = await fetch(`/api/storage/files/${id}/download/`, { credentials: 'include' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка скачивания');
      }
      // получает blob и создаётся ссылка для скачивания
      const blob = await res.blob();
      // получает оригинальное имя из header Content-Disposition
      const cd = res.headers.get('Content-Disposition') || '';
      let filename = 'file';
      const match = /filename="(.+)"/.exec(cd);
      if (match) filename = match[1];
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Ошибка: ' + (err.message || err));
    }
  }

  async function remove(id) {
    if (!window.confirm('Удалить файл?')) return;
    try {
      await apiFetch(`/storage/files/${id}/`, { method: 'DELETE' });
      if (onChange) onChange();
    } catch (err) {
      alert('Ошибка удаления: ' + (err.payload || err.message));
    }
  }

  function startEdit(f) {
    setEditing(f.id);
    setEditName(f.original_name);
    setEditComment(f.comment || '');
  }

  async function saveEdit(id) {
    try {
      await apiFetch(`/storage/files/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ new_name: editName, comment: editComment })
      });
      setEditing(null);
      setMsg('Сохранено');
      if (onChange) onChange();
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      alert('Ошибка: ' + (err.payload || err.message));
    }
  }

  async function getLink(id) {
    try {
      const res = await apiFetch(`/storage/files/${id}/share/`, { method: 'POST' });
      const token = res.special_link;
      const url = `${window.location.origin}/download/s/${token}/`;
      // копируется в буфер обмена
      await navigator.clipboard.writeText(url);
      setMsg('Ссылка скопирована в буфер обмена');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      alert('Ошибка получения ссылки: ' + (err.payload || err.message));
    }
  }

  return (
    <div>
      <h3>Файлы</h3>
      {msg && <div style={{ color: 'green' }}>{msg}</div>}
      <table border="1" cellPadding="6" style={{ width: '100%', marginTop: 8 }}>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Комментарий</th>
            <th>Размер (байт)</th>
            <th>Загружен</th>
            <th>Последнее скачивание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 && <tr><td colSpan="6">Файлов нет</td></tr>}
          {files.map(f => (
            <tr key={f.id}>
              <td>
                {editing === f.id ? <input value={editName} onChange={e => setEditName(e.target.value)} /> : f.original_name}
              </td>
              <td>
                {editing === f.id ? <input value={editComment} onChange={e => setEditComment(e.target.value)} /> : f.comment}
              </td>
              <td>{f.size}</td>
              <td>{f.uploaded_at ? new Date(f.uploaded_at).toLocaleString() : ''}</td>
              <td>{f.last_downloaded_at ? new Date(f.last_downloaded_at).toLocaleString() : ''}</td>
              <td>
                {editing === f.id ? (
                  <>
                    <button onClick={() => saveEdit(f.id)}>Сохранить</button>
                    <button onClick={() => setEditing(null)}>Отмена</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => download(f.id)}>Скачать</button>
                    <button onClick={() => startEdit(f)}>Переименовать/коммент</button>
                    <button onClick={() => remove(f.id)}>Удалить</button>
                    <button onClick={() => getLink(f.id)}>Получить ссылку</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}