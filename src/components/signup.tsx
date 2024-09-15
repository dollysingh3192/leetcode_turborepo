import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState(false); // New state to track successful sign-up
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true); // Set success to true on successful sign-up
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Sign Up
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="mb-4">Account created successfully!</p>
          <p>
            <a
              href="#"
              className="text-blue-500 underline"
              onClick={() => navigate('/signIn')}
            >
              Click here to sign in
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
