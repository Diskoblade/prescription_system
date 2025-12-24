import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(email, password)) {
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="card w-full max-w-md p-8 bg-white shadow-lg">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-cyan-100 rounded-full mb-4">
                        <Stethoscope size={32} color="#0e7490" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome to MediScript</h2>
                    <p className="text-slate-500">Sign in to your doctor account</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="doctor@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                    <p>Demo Mode: Use any email/password to login</p>
                </div>
            </div>
        </div>
    );
}
