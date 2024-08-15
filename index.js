const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [
  { id: 1, username: 'user1', password: '$2b$10$6H/.6sZPFAJxPbldKoOW0u7BXgLf/J6HY9FgpmVZALw2kmiwSR2uO' } // Password is 'password'
];

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });

  res.json({ token });
});


const expenses = [];

// Retrieve all expenses for a user
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// Add a new expense
app.post('/api/expenses', (req, res) => {
  const { description, amount } = req.body;
  const newExpense = { id: expenses.length + 1, description, amount };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Update an existing expense
app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { description, amount } = req.body;
  const expense = expenses.find(exp => exp.id === parseInt(id));

  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  expense.description = description;
  expense.amount = amount;
  res.json(expense);
});

// Delete an existing expense
app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const index = expenses.findIndex(exp => exp.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  expenses.splice(index, 1);
  res.status(204).send();
});

// Calculate the total expense for a user
app.get('/api/expense', (req, res) => {
    const totalExpense = expenses.reduce((total, exp) => total + exp.amount, 0);
    res.json({ totalExpense });
  });

  
  const { body, validationResult } = require('express-validator');

  // Example validation for adding a new expense
  app.post('/api/expenses',
    body('description').notEmpty().withMessage('Description is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // Handle expense creation
    });
  
