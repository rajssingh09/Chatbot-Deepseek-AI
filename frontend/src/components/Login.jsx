import React, { useState } from 'react';
import { Link,useNavigate} from 'react-router-dom';
import { Eye } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
// console.log(formData);
const [error, setError]=useState('');
const [loading, setLoading]=useState(false);

const navigate=useNavigate(); 


const [,setAuthUser]=useAuth();

const handleChange = (e) => {
  const value=e.target.value;
  const name= e.target.name;
  setFormData({
    ...formData,
    [name]: value
  })
}
 const handleSignup=async()=>{
  setLoading(true);
  setError(''); 
   try{
      const {data}=await axios.post('http://localhost:4002/api/v1/user/login', {
        email: formData.email,
        password: formData.password
      },{
        withCredentials: true,
      })
      alert(data.message || "Login successful")
      console.log(data);
      localStorage.setItem('user',JSON.stringify(data.user)) // Store user data in localStorage;
      localStorage.setItem("token",data.token) // Store user data in localStorage
      setAuthUser(data.token); // Update auth context
      navigate('/')// Redirect to login page after successful signup
   }catch(error){
    const msg= error?.response?.data?.error||"Signup failed"
     setError(msg);
   }
    finally{
      setLoading(false); // Reset loading state after request
    }  
 }
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-3">
      <div className="bg-[#1e1e1e] text-white w-full max-w-md mx-auto p-6 rounded-lg shadow-lg space-y-4">

        {/* Heading */}
        <h1 className="text-center text-2xl font-bold">Login</h1>


        {/* Email */}
        <div>
          <input
            type="email"
            name='email'
            placeholder="Email"
            className="w-full bg-transparent text-white  border border-gray-600 placeholder:text-white h-8 rounded-md px-2"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            name='password'
            placeholder="Password"
            className="w-full bg-transparent  text-white border border-gray-600 placeholder:text-white h-8 rounded-md px-2 focus:ring-2 focus:ring-blue-500 transition"
            value={formData.password}
            onChange={handleChange} 
          />
          <span className="absolute text-gray-400 top-2 right-3 cursor-pointer">
            <Eye size={18} />
          </span>
        </div>

        {/* Error Message */}
        <div className="text-red-600 text-sm">
          {error && <span>{error}</span>}
        </div>
 
        {/* Terms and Conditions */}
        <p className="text-xs text-gray-400">
          By signing up or logging in, you consent to DeepSeek's{" "}
          <a href="#" className="underline">Terms of Use</a> and{" "}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>

        {/* Signup Button */}
        <div>
          <button onClick={handleSignup} 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          
          {loading? 'logging in...': 'Login'}
          </button>
        </div>

        {/* Already Registered */}
        <div className="text-sm text-center ">
          <span className="text-gray-400 ">Haven't account? </span>
          <Link to="/signup" className="text-blue-400 hover:underline">Signup</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
