//Create a Landing page with a header and a button to navigate to the Problems page
import { Link } from "react-router-dom";

const Landing = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-4">
      <h1 className="text-4xl font-bold mb-6">LeetCode Clone</h1>
      <p className="text-lg mb-8">Welcome to LeetCode Clone! Start solving problems and improve your coding skills.</p>
      
      <div className="space-y-4">
        <Link to="/signup">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;