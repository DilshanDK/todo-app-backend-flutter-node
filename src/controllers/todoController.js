import Todo from '../models/Todo.js';

// Helper function to get Sri Lankan time
const getSriLankanTime = () => {
  const now = new Date();
  const sriLankaOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utcTime + sriLankaOffset);
};

/**
 * @desc    Get all todos
 * @route   GET /api/todos
 * @access  Public
 */
export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single todo by ID
 * @route   GET /api/todos/:id
 * @access  Public
 */
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new todo
 * @route   POST /api/todos
 * @access  Public
 */
export const createTodo = async (req, res) => {
  try {
    const { todo_title, todo_desc, todo_date, todo_status } = req.body;

    const todo = new Todo({
      todo_title,
      todo_desc: todo_desc || '',
      todo_date: todo_date ? new Date(todo_date) : getSriLankanTime(),
      todo_status: todo_status || 'pending',
    });

    await todo.save();

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create todo',
      error: error.message,
    });
  }
};

/**
 * @desc    Update a todo
 * @route   PUT /api/todos/:id
 * @access  Public
 */
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { todo_title, todo_desc, todo_date, todo_status } = req.body;

    const updateData = {};
    if (todo_title !== undefined) updateData.todo_title = todo_title;
    if (todo_desc !== undefined) updateData.todo_desc = todo_desc;
    if (todo_date !== undefined) updateData.todo_date = new Date(todo_date);
    if (todo_status !== undefined) updateData.todo_status = todo_status;

    const todo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update todo',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a todo
 * @route   DELETE /api/todos/:id
 * @access  Public
 */
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: todo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete todo',
      error: error.message,
    });
  }
};

/**
 * @desc    Update todo status only
 * @route   PATCH /api/todos/:id/status
 * @access  Public
 */
export const updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { todo_status } = req.body;

    if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(todo_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, in_progress, completed, or cancelled',
      });
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      { todo_status },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: todo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update status',
      error: error.message,
    });
  }
};
