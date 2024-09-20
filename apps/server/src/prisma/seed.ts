import prisma from '../prisma'; 

async function main() {
  // Default data for the Problem collection
  const problems = [
    {
      title: 'Two Sum',
      description_body: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
      difficulty: 'Easy',
      testCases: {
        create: [
          { input: '[2, 7, 11, 15], 9', output: '[0, 1]' },
          { input: '[3, 2, 4], 6', output: '[1, 2]' },
        ],
      },
    },
    {
      title: 'Reverse Integer',
      description_body: 'Given a signed 32-bit integer x, return x with its digits reversed.',
      difficulty: 'Medium',
      testCases: {
        create: [
          { input: '123', output: '321' },
          { input: '-123', output: '-321' },
        ],
      },
    },
    {
      title: 'Palindrome Number',
      description_body: 'Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.',
      difficulty: 'Easy',
      testCases: {
        create: [
          { input: '121', output: 'true' },
          { input: '-121', output: 'false' },
        ],
      },
    },
  ];

  // Insert problems into the database
  for (const problem of problems) {
    await prisma.problem.create({
      data: problem,
    });
  }
}

main()
  .then(() => {
    console.log('Data seeded successfully');
  })
  .catch((error) => {
    console.error('Error seeding data: ', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
