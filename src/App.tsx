import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Problems, Landing, ProblemDetail } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
