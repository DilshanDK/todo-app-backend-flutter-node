import express from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  updateTodoStatus,
} from '../controllers/todoController.js';

const router = express.Router();

// ===========================================
// ROUTE FLOW EXPLANATION:
// ===========================================
// 1. Client sends HTTP request to /api/todos
// 2. Express Router matches the URL pattern & HTTP method
// 3. Router calls the corresponding Controller function
// 4. Controller interacts with Model (MongoDB)
// 5. Controller sends response back to client
// ===========================================

// GET    /api/todos          → getAllTodos()    → Fetch all todos
// GET    /api/todos/:id      → getTodoById()    → Fetch single todo
// POST   /api/todos          → createTodo()     → Create new todo
// PUT    /api/todos/:id      → updateTodo()     → Update entire todo
// PATCH  /api/todos/:id/status → updateTodoStatus() → Update status only
// DELETE /api/todos/:id      → deleteTodo()     → Delete todo

router.get('/', getAllTodos);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.patch('/:id/status', updateTodoStatus);
router.delete('/:id', deleteTodo);

export default router;
