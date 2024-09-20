interface Problem {
    id: string;
    title: string;
    difficulty: string;
    statement: string;
  }

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

interface Submission {
    id: string;
    code: string;
    language: string;
    result: string;
    userId: string;
    problemId: string;
}

interface TestCase {
    id: string;
    input: string;
    output: string;
    problemId: string;
}   

export type { Problem, User, Submission, TestCase };    