import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../constants";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description_body: string;
  testCases: TestCase[];
}

interface TestCase {
  input: string;
  output: string;
}

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = React.useState<Problem | null>(null);
  // Create state to store textarea content
  const [code, setCode] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/api/problem/${id}`).then(({ data }) => {
      setProblem(data);
    });
  }, [id]);

  if (!problem) {
    return <div>Loading...</div>;
  }

  const handleSubmitCode = (id: string) => {
    axios({
      method: "post",
      url: `${API_URL}/api/problem/submit/${id}`,
      data: {
        code
      },
    });
  };

  // Handle textarea value change
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Part: Problem Details */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <p className="text-sm text-gray-500 mb-2">
            Difficulty: {problem.difficulty}
          </p>
          <p className="text-gray-700">{problem.description_body}</p>
          {/* Test Cases Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
            <ul className="space-y-4">
              {problem.testCases.map((testCase, index) => (
                <li key={index} className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Input:</span> {testCase.input}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Output:</span> {testCase.output}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Part: Code Editor */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Code</h2>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write your code here..."
            value={code} // Bind the textarea value to the state
            onChange={handleChange} // Update state on every change
          ></textarea>
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => handleSubmitCode(problem.id)}
          >
            Submit Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
