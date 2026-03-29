import { useState } from "react";

type Props = {
  onLogin: (username: string, password: string) => Promise<void>;
  error: string;
};

const LoginScreen = ({ onLogin, error }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onLogin(username, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      
      {/* Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-6 sm:p-8">
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">
          School Management
        </h2>
        <p className="text-center text-white/80 mb-6 text-sm">
          Sign in to continue
        </p>

        {/* Username */}
        <div className="mb-4">
          <label className="text-white text-sm">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-white text-sm">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 text-red-200 text-sm p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <p className="text-center text-white/70 text-xs mt-6">
          © 2026 School System
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;