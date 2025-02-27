import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import Logo from "../assets/kainoslogo.png"
import { FaEye, FaEyeSlash } from "react-icons/fa";



const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(""); // Added username state
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
  
    if (!email || !password || (!isLogin && !username)) {
      setError("Please fill in all required fields.");
      return;
    }
  
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      if (isLogin) {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, password);
        
        // Set authentication status to localStorage
        localStorage.setItem("isAuthenticated", "true");
        navigate("/"); // Redirect to the Dashboard page after login
      } else {
        // Sign Up Logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Store user details in Firebase Realtime Database
        await set(ref(db, `Users/${user.uid}`), {
          userId: user.uid,
          email: email,
          username: username,  // Store username
          role: "Admin", // Automatic Admin role
          grade: "", // Optional
        });
  
        // Set authentication status to localStorage
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard"); // Redirect to the Dashboard page after sign-up
      }
    } catch (error) {
      setError(error.message);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-primaryBlue">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
      <div className="flex justify-center items-center w-full">
        <img src={Logo} className="ml-3" alt="Logo" />
      </div>        
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

        <form onSubmit={handleAuth} className="mt-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
              {!isLogin && (
            <>
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </>
          )}

        <div className="mb-3 relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-primaryBlue"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

          {!isLogin && (
            <>
            
            <div className="mb-3 relative">
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full px-3 py-2 border rounded-md focus:outline-none pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-primaryBlue"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <FaEyeSlash className="w-5 h-5" />
            ) : (
              <FaEye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
            </>
          )}

          <button type="submit" className="w-full bg-primaryBlue text-white py-2 rounded-md">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="text-primaryBlue cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
