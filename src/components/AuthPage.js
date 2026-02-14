import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { MailIcon, UserPlusIcon, ChevronLeftIcon } from './Icons';

export const AuthPage = ({ onLogin }) => {
  const [authStep, setAuthStep] = useState('method');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !name) { setError('Заполните все поля'); return; }
    setLoading(true); setError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name } }
      });
      if (error) throw error;
      if (data.user) {
        alert('Регистрация успешна!');
        setAuthStep('method');
      }
    } catch (error) { setError(error.message); } 
    finally { setLoading(false); }
  };

  const handleSignIn = async () => {
    if (!email || !password) { setError('Введите email и пароль'); return; }
    setLoading(true); setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) onLogin(data.user);
    } catch (error) { setError(error.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen w-full bg-[#1b1b1c]">
      <div className="m-auto w-full max-w-sm p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black logo-text mb-2">Все Свои</h1>
          <p className="text-gray-400 text-sm">Общайтесь с теми, кто важен</p>
        </div>
        <div className="bg-[#2d2d2e] rounded-[28px] shadow-xl p-8">
          {authStep === 'method' && (
            <div className="space-y-4">
              <button onClick={() => setAuthStep('login')} className="w-full p-4 bg-[#363637] rounded-xl flex items-center gap-3 hover:bg-[#404041]">
                <MailIcon className="text-purple-500" /><span className="font-bold text-white">Войти по Email</span>
              </button>
              <button onClick={() => setAuthStep('register')} className="w-full p-4 bg-[#363637] rounded-xl flex items-center gap-3 hover:bg-[#404041]">
                <UserPlusIcon className="text-blue-500" /><span className="font-bold text-white">Регистрация</span>
              </button>
            </div>
          )}
          {authStep === 'login' && (
            <div className="space-y-4">
              <button onClick={() => setAuthStep('method')} className="text-blue-500 flex items-center gap-1"><ChevronLeftIcon /> Назад</button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-[#363637] rounded-xl text-white outline-none" />
              <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-[#363637] rounded-xl text-white outline-none" />
              <button onClick={handleSignIn} disabled={loading} className="w-full bg-blue-500 text-white p-4 rounded-xl font-bold">{loading ? 'Вход...' : 'Войти'}</button>
            </div>
          )}
          {authStep === 'register' && (
            <div className="space-y-4">
              <button onClick={() => setAuthStep('method')} className="text-blue-500 flex items-center gap-1"><ChevronLeftIcon /> Назад</button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-[#363637] rounded-xl text-white outline-none" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-[#363637] rounded-xl text-white outline-none" />
              <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-[#363637] rounded-xl text-white outline-none" />
              <button onClick={handleSignUp} disabled={loading} className="w-full bg-green-500 text-white p-4 rounded-xl font-bold">{loading ? 'Регистрация...' : 'Создать'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};