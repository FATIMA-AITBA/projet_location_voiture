'use client';
import { useState } from 'react';

type TabType = 'login' | 'register';



export default function AgenceAuthPage() {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    nom: '',
    adresse: '',
    contact: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/agences/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);

    
        localStorage.setItem('token', data.token);
        //localStorage.setItem('agence', JSON.stringify(data.agence));
        localStorage.setItem('user', JSON.stringify({
          id: data.agence.id,
          nom: data.agence.nom,
          email: data.agence.email,
          description: data.agence.description,
          contact: data.agence.contact,
          adresse: data.agence.adresse,
          type: 'agence'
        }));
        

        window.location.href = '/';
      } else {
        setMessage(data.message || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur de connexion', error);
      setMessage('Erreur de connexion');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/agences/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      setMessage(data.message);

    
    } catch (error) {
      console.error('Erreur d’inscription', error);
      setMessage('Erreur d’inscription');
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center font-bold text-xl mb-4">Espace Agence</h2>

        <div className="flex justify-between mb-6 border-b">
          <button
            className={`pb-2 px-4 font-semibold ${activeTab === 'login' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('login'); setMessage(''); }}
          >
            Login
          </button>
          <button
            className={`pb-2 px-4 font-semibold ${activeTab === 'register' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('register'); setMessage(''); }}
          >
            Register
          </button>
        </div>

        {message && <p className="text-center text-sm text-red-500 mb-4">{message}</p>}

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700">Mot de passe</label>
              <input
                type="password"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Se connecter
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700">Nom de l'agence</label>
              <input
                type="text"
                value={registerData.nom}
                onChange={e => setRegisterData({ ...registerData, nom: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700">Adresse</label>
              <input
                type="text"
                value={registerData.adresse}
                onChange={e => setRegisterData({ ...registerData, adresse: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700">Telephone</label>
              <input
                type="text"
                value={registerData.contact}
                onChange={e => setRegisterData({ ...registerData, contact: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={registerData.email}
                onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700">Mot de passe</label>
              <input
                type="password"
                value={registerData.password}
                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              S'inscrire
            </button>
          </form>
        )}
      </div>
    </div>
  );
}