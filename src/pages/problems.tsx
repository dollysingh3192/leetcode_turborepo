import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../constants";

const Problems = () => {
  const [problemListData, setProblemListData] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/problem`).then(({ data }) => {
      setProblemListData(data);
    });
  }, []);

  return (
    <div>
      <h1>Problems</h1>
      <p>{problemListData}</p>
    </div>
  );
};

export default Problems;
