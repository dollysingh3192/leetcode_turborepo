import AMQPService from "./rabbit-receiver";
import prisma from "@repo/prisma-schema";
import { exec } from "child_process";

interface TestCase {
  id: string;
  input: string;
  output: string;
  problemId: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  statement: string;
  testCases: TestCase[];
  functionName: string;
  test: any;
}

const handleTestFunction = `
function handleTests(testCases, func) {
    let testCase;
    let problemInput;
    let expectedOut;
    let yourOut;
    let testCaseNumber;
    let status;
    let ERR;
    let date = new Date();
    let runtime;
    let t1;
    for (let i = 0; i < testCases.length; i++) {
            let out;
            try {
                const input = testCases[i].slice(0, testCases[i].length - 1);
                const exOutput = testCases[i][testCases[i].length - 1];
                t1 = performance.now();
                out = func(...input);
                if (!equality(out, exOutput)) {
                        problemInput = JSON.stringify(input);
                        testCase = testCases[i];
                        expectedOut = JSON.stringify(exOutput);
                        yourOut = JSON.stringify(out);
                        testCaseNumber = i;
                        status = "Wrong Answer";

                        ERR = \`Wrong answer; Test Case Number: \${i}; Input: \${JSON.stringify(input)}; Expected Output: \${exOutput}; Your Output: \${out};\`;
                }
            } catch (e) {
                    ERR = e;
                    status = "Runtime Error";
            }
    }
    runtime = performance.now() - t1;

    if (ERR == undefined && testCase == undefined) status = "Accepted";
    return \`{ "status":"\${status}",\n"date":"\${date}",\n"runtime": "\${runtime}",\n"error_message": "\${ERR}",\n"test_case_number" :"\${testCaseNumber}",\n"test_case":"\${testCase}",\n"input": "\${problemInput}",\n"expected_output":"\${expectedOut}",\n"user_output":"\${yourOut}"\n}\`;
}

function equality(item1, item2) {
    const isArrayItem1 = Array.isArray(item1);
    const isArrayItem2 = Array.isArray(item2);
    if (isArrayItem1 !== isArrayItem2) return false;
    if (isArrayItem1) {
            if (item1.length !== item2.length) return false;
            for (let i = 0; i < item1.length; i++) {
                    const indexof = item2.indexOf(item1[i]);
                    if (indexof === -1) return false;
                    item2.splice(indexof, 1);
            }
            if (item2.length !== 0) return false;
            else return true;
    }
    return item1 === item2;
}`;

// Function to run the code with a time limit
const runCodeWithTimeout = (
  code: string,
  timeout: number,
  problem: Problem
) => {
  const { testCases, functionName, test } = problem;

  let data =
    "(function x() { try {" +
    code +
    handleTestFunction +
    `try { return (handleTests(${JSON.stringify(
      testCases
    )}, ${functionName})); } catch (e) { return (\`{ "status":"Runtime Error",
        "date":"${new Date()}",
        "runtime": 0,
        "error_message": "\${e}",
        "test_case_number" :"undefined",
        "test_case":"undefined",
        "expected_output":"undefined",
        "user_output":"undefined"
        }\`); }} catch (e) { return (\`{ "status":"Runtime Error",
        "date":"${new Date()}",
        "runtime": 0,
        "error_message": "\${e}",
        "test_case_number" :"undefined",
        "test_case":"undefined",
        "expected_output":"undefined",
        "user_output":"undefined"
        }\`); }})()`;

  console.log("🚀 ~ runCodeWithTimeout ~ data:", data);

  return new Promise((resolve, reject) => {
    try {
        const stdout = eval(data);
        console.log(stdout);
        resolve({
            stdout: JSON.parse(stdout),
            stdout_string: stdout,
            stderr: "",
            code_body: code,
        });
    } catch (error) {
        return reject({
            stdout: error,
            stdout_string: "",
            stderr: "",
            code_body: code,
        });
    }
});
};

(async () => {
  const amqpService = await AMQPService.getInstance();

  await amqpService.consumeMessages(async (msg: any) => {
    // Adjust the type based on the actual message type from AMQP Service
    const message = msg.content.toString();
    const data: {
      problemId: string;
      codeSubmission: string;
      timestamp: Date;
      userId: string;
    } = JSON.parse(message);

    const { problemId, codeSubmission, timestamp, userId } = data;

    const problem = await prisma.problem.findUnique({
      where: {
        id: problemId,
      },
      include: {
        testCases: {
          select: {
            id: true,
            input: true,
            output: true,
          },
        },
      },
    });
    console.log("🚀 ~ awaitamqpService.consumeMessages ~ problem:", problem);

    const submission = await prisma.submission.create({
      data: {
        code: codeSubmission,
        language: "JavaScript",
        result: "Pending",
        userId: userId,
        problemId: problemId,
        createdAt: timestamp,
      },
    });

    let result: string;

    try {
      // Set a timeout limit in milliseconds (e.g., 5000 ms for 5 seconds)
      const executionTimeout = 5000;

      // Execute the code with a timeout
      const output = await runCodeWithTimeout(
        codeSubmission,
        executionTimeout,
        problem
      );

      // If successful, set result to 'Success'
      result = "Success";

      // Optionally, you can store the output if needed
      console.log("Execution Output:", output);
    } catch (error) {
      if (error === "TLE") {
        // Time Limit Exceeded
        result = "TLE";
      } else {
        // Other errors (e.g., syntax errors)
        result = `Error: ${error}`;
      }
    }

    // Update the submission record in the DB with the result
    await prisma.submission.update({
      where: { id: submission.id },
      data: { result },
    });

    console.log(`Submission result for user ${userId}: ${result}`);
  });
})();
