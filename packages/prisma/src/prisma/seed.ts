import prisma from '../index'; 

async function main() {
  // Default data for the Problem collection
  const problems = [
    {
      title: 'Two Sum',
      description_body: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
      difficulty: 'Easy',
      functionName: 'twoSum',
      content: 'function twoSum(nums, target) {}',
      testCases: {
        create: [
          { input: '[2, 7, 11, 15], 9', output: '[0, 1]' },
          { input: '[3, 2, 4], 6', output: '[1, 2]' },
        ],
      },
      test: [
        [
            [
                2,
                7,
                11,
                15
            ],
            9,
            [
                0,
                1
            ]
        ],
        [
            [
                3,
                2,
                4
            ],
            6,
            [
                1,
                2
            ]
        ],
        [
            [
                3,
                3
            ],
            6,
            [
                0,
                1
            ]
        ]
    ],
    },
    {
      title: 'Reverse Integer',
      description_body: 'Given a signed 32-bit integer x, return x with its digits reversed.',
      difficulty: 'Medium',
      functionName: 'reverse',
      content: 'function reverse(num) {}',
      testCases: {
        create: [
          { input: '123', output: '321' },
          { input: '-123', output: '-321' },
        ],
      },
      test: [
        [
          123,
          321
        ],
        [
          -123, 
          -321
        ]
      ]
    },
    {
      title: 'Palindrome Number',
      description_body: 'Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.',
      difficulty: 'Easy',
      functionName: 'palindrome',
      content: 'function palindrome(num) {}',
      testCases: {
        create: [
          { input: '121', output: 'true' },
          { input: '-121', output: 'false' },
        ],
      },
      test: [
        [
          121,
          true
        ],
        [
          -121,
          false
        ]
      ]
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
