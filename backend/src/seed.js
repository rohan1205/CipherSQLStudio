require('dotenv').config();
const mongoose = require('mongoose');
const connectMongo = require('./config/mongo');
const Assignment = require('./models/Assignment');

const assignments = [
  {
    title: 'Find All Employees',
    description: 'Practice basic SELECT queries on the employees table',
    difficulty: 'Easy',
    question: 'Write a SQL query to fetch all employees who work in the Engineering department.',
    tableName: 'employees',
    expectedColumns: ['id', 'name', 'department', 'salary', 'hire_date'],
  },
  {
    title: 'High Earners',
    description: 'Filter employees based on salary conditions',
    difficulty: 'Easy',
    question: 'Write a SQL query to find all employees with a salary greater than 75000. Show their name and salary only.',
    tableName: 'employees',
    expectedColumns: ['name', 'salary'],
  },
  {
    title: 'Department Salary Average',
    description: 'Use aggregate functions to analyze salary data',
    difficulty: 'Medium',
    question: 'Write a SQL query to find the average salary for each department. Order the results by average salary in descending order.',
    tableName: 'employees',
    expectedColumns: ['department', 'avg'],
  },
  {
    title: 'Expensive Products',
    description: 'Filter products by price range',
    difficulty: 'Easy',
    question: 'Write a SQL query to find all products with a price greater than 100. Show the product name, category, and price.',
    tableName: 'products',
    expectedColumns: ['name', 'category', 'price'],
  },
  {
    title: 'Low Stock Alert',
    description: 'Find products that need restocking',
    difficulty: 'Medium',
    question: 'Write a SQL query to find all products where stock is less than 50, ordered by stock quantity from lowest to highest.',
    tableName: 'products',
    expectedColumns: ['name', 'stock'],
  },
];

const seed = async () => {
  await connectMongo();
  await Assignment.deleteMany({});
  await Assignment.insertMany(assignments);
  console.log('✅ Assignments seeded successfully!');
  process.exit(0);
};

seed();