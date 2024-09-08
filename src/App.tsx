import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Problems, Landing } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/problems" element={<Problems />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
