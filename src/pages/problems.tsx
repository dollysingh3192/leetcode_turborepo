import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../constants";
import { useNavigate } from "react-router-dom";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  statement: string;
}

const Problems = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/problem`).then(({ data }) => {
      setProblems(data);
    });
  }, []);

  // Handle problem click
  const handleProblemClick = (id: string) => {
    navigate(`/problems/${id}`);
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-8">Problem List</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Difficulty
              </th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id} className="border-t cursor-pointer hover:bg-gray-100" onClick={() => handleProblemClick(problem.id)}>
                <td className="px-6 py-4 text-gray-700">{problem.title}</td>
                <td className="px-6 py-4 text-gray-700">
                  {problem.difficulty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Problems;
