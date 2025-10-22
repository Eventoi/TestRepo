import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../store/authReducer';
import { useNavigate } from 'react-router-dom';

// Валидация по ТЗ:
// логин: латинские буквы и цифры, первый символ — буква, длина от 4 до 20
// email - простой regex
// пароль — не менее 6 символов: минимум 1 заглавная, 1 цифра, 1 спец. символ

const usernameRegex = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /(?=.{6,})(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

export default function RegisterPage() {
  const [form, setForm] = useState({ username:'', full_name:'', email:'', password:'' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const dispatch = useDispatch();
  const nav = useNavigate();

  function validate() {
    const e = {};
    if (!usernameRegex.test(form.username)) e.username = 'Логин: 4-20 символов, латиница, начинается с буквы';
    if (!emailRegex.test(form.email)) e.email = 'Неверный email';
    if (!passwordRegex.test(form.password)) e.password = 'Пароль: min 6, 1 заглавная, 1 цифра, 1 спец. символ';
    return e;
  }

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      await dispatch(register(form));
      // после регистрации перенаправляем на страницу входа
      nav('/login');
    } catch (err) {
      setServerError(err.payload || (err.message || 'Ошибка'));
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Регистрация</h2>
      <form onSubmit={submit}>
        <div>
          <label>Логин</label><br />
          <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
          {errors.username && <div style={{color:'red'}}>{errors.username}</div>}
        </div>

        <div>
          <label>Полное имя</label><br />
          <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
        </div>

        <div>
          <label>Email</label><br />
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          {errors.email && <div style={{color:'red'}}>{errors.email}</div>}
        </div>

        <div>
          <label>Пароль</label><br />
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          {errors.password && <div style={{color:'red'}}>{errors.password}</div>}
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit">Зарегистрироваться</button>
        </div>
        {serverError && <div style={{color:'red', marginTop:10}}>{JSON.stringify(serverError)}</div>}
      </form>
    </div>
  );
}