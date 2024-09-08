//Create a Landing page with a header and a button to navigate to the Problems page

import { useState } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <h1 className="text-3xl">LeetCode Clone</h1>
      <p>Welcome to LeetCode Clone!</p>
      <Link to="/problems">
        <button>Problems</button>
      </Link>
    </div>
  );
};

export default Landing;