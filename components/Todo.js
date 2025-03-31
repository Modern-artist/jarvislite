"use client";
import React, { useEffect } from 'react';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "nanoid";
import { addTask, removeTask, editTask, updateStatus } from "@/store/taskSlice";
import {
    Box,
    Button,
    Modal,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
} from "@mui/material";
import { Add, Delete, Edit, TaskAlt } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Define item types for drag and drop
const ItemTypes = {
    TASK: 'task',
};

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 420,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

// Task component with drag functionality
const DraggableTask = ({ task, handleEdit, removeTask }) => {
    const dispatch = useDispatch();

    // Set up drag functionality
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <Box
            className="bg-slate-800  text-slate-200"
            ref={drag}
            key={task.id}
            sx={{
                p: 2,
                borderRadius: 2,
                // bgcolor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                // border: "1px solid #eaeaea",
                transition: "transform 0.2s, box-shadow 0.2s",
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }
            }}
        >
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1.5
            }}>
                <Typography variant="subtitle1" fontWeight="600" >
                    {task.title}
                </Typography>

                <Chip
                    size="small"
                    className=' text-slate-200'
                    label={task.priority}
                    sx={{
                        fontWeight: "600",
                        fontSize: "0.7rem",
                        height: 22,
                        bgcolor:
                            task.priority === "High" ? "#FFEBEE" :
                                task.priority === "Medium" ? "#FFF3E0" :
                                    "#E8F5E9",
                        color:
                            task.priority === "High" ? "#D32F2F" :
                                task.priority === "Medium" ? "#F57C00" :
                                    "#2E7D32",

                    }}
                />
            </Box>

            {task.description && (
                <Typography
                    variant="body2"
                    // color="text.secondary"
                    className=' text-slate-200'
                    sx={{
                        mb: 2,
                        fontSize: "0.875rem",
                        WebkitLineClamp: 2,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                >
                    {task.description}
                </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<Edit fontSize="small" />}
                    onClick={() => handleEdit(task)}
                >
                    Edit
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete fontSize="small" />}
                    onClick={() => dispatch(removeTask(task.id))}
                >
                    Delete
                </Button>
            </Box>
        </Box>
    );
};

// Status column component with drop functionality
const StatusColumn = ({ status, tasks, handleEdit, removeTask }) => {
    const dispatch = useDispatch();

    // Set up drop functionality
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.TASK,
        drop: (item) => handleDrop(item.id, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Handle dropping a task into this column
    const handleDrop = (taskId, newStatus) => {
        console.log(taskId, newStatus)
        // Find the task in the Redux store
        const taskToUpdate = tasks.find(t => t.id === taskId);
        console.log('drop called', taskToUpdate.status, newStatus)
        // console.log("taskToUpdate", taskToUpdate, "taskToUpdate.status !== newStatus", taskToUpdate.status !== newStatus)
        if (taskToUpdate && taskToUpdate.status !== newStatus) {
            dispatch(updateStatus({
                id: taskId,
                status: newStatus
            }));
        }
        console.log(tasks)
    }

    // Filter tasks for this status column
    const statusTasks = tasks.filter((task) => task.status === status);

    return (
        <div className='col-span-1 bg-slate-900 text-slate-200 rounded-2xl w-full' key={status}>
            <Box
                ref={drop}
                sx={{
                    // bgcolor: isOver ? "#f0f7ff" : "#f8f9fa",
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "background-color 0.2s ease",
                    border: isOver ? "2px dashed #2196F3" : "2px solid transparent",
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        borderBottom: "1px solid #333333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{
                            color:
                                status === "Completed" ? "success.700" :
                                    status === "InProgress" ? "info.700" :
                                        "warning.700"
                        }}
                    >
                        {status === "InProgress" ? "In Progress" : status} ({statusTasks.length})
                    </Typography>

                    <Chip
                        size="small"
                        label={statusTasks.length}
                        sx={{
                            bgcolor:
                                status === "Completed" ? "success.100" :
                                    status === "InProgress" ? "info.100" :
                                        "warning.100",
                            color:
                                status === "Completed" ? "success.800" :
                                    status === "InProgress" ? "info.800" :
                                        "warning.800"
                        }}
                    />
                </Box>

                <Box className="p-5" sx={{ minHeight: "200px" }}>
                    {statusTasks.length === 0 ? (
                        <Box className="bg-slate-800 text-slate-200" sx={{
                            py: 4,
                            textAlign: "center",
                            // color: "text.secondary",
                            border: "2px dashed #e0e0e0",
                            borderRadius: 2,
                            // bgcolor: "background.paper"
                        }}>
                            <Typography variant="body2">
                                {isOver ? "Drop task here" : "No tasks in this status"}
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={2}>
                            {statusTasks.map((task) => (
                                <DraggableTask
                                    key={task.id}
                                    task={task}
                                    handleEdit={handleEdit}
                                    removeTask={removeTask}
                                />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Box>
        </div>
    );
};

export default function Todo() {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [task, setTask] = useState({
        id: nanoid(),
        title: "",
        description: "",
        priority: "",
        status: "",
    });

    const statuses = ["Pending", "InProgress", "Completed"];
    useEffect(() => {

    }, [third])

    const tasks = useSelector((state) => state.tasks.tasks);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (isEditing) {
            dispatch(editTask(task));
        } else {
            dispatch(addTask(task));
        }
        resetForm();
    };

    const handleEdit = (taskToEdit) => {
        setTask(taskToEdit);
        setIsEditing(true);
        setOpen(true);
    };

    const resetForm = () => {
        setTask({ id: nanoid(), title: "", description: "", priority: "", status: "" });
        setIsEditing(false);
        setOpen(false);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className=" ">
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                    Add Task
                </Button>

                {tasks.length > 0 ? (
                    <Box className="p-10">
                        <Typography onClick={() => console.log(tasks)} variant="h5" fontWeight="600" className=' text-slate-200' sx={{ mb: 3 }}>
                            Task Management Board
                        </Typography>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 p-5 text-gray-200'>
                            {statuses.map((status) => (
                                <StatusColumn
                                    key={status}
                                    status={status}
                                    tasks={tasks}
                                    handleEdit={handleEdit}
                                    removeTask={(id) => dispatch(removeTask(id))}
                                />
                            ))}
                        </div>
                    </Box>
                ) : (
                    <Box
                        className="bg-slate-900 mb-10"
                        sx={{
                            textAlign: "center",
                            py: 8,
                            px: 3,
                            mt: 4,
                            // bgcolor: "background.paper",
                            borderRadius: 3,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                        }}
                    >
                        <TaskAlt sx={{ fontSize: 48, color: "primary.main", opacity: 0.6, mb: 2 }} />
                        <Typography variant="h5" className=' text-slate-200' sx={{ mb: 1 }}>
                            No tasks yet
                        </Typography>
                        <Typography variant="body1" className=' text-slate-200' sx={{ mb: 3, maxWidth: 500, mx: "auto" }}>
                            Your task board is empty. Click the Add Task button to create your first task.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<Add />}
                            onClick={() => setOpen(true)}
                        >
                            Add Your First Task
                        </Button>
                    </Box>
                )}

                {/* Task Modal */}
                <Modal open={open} onClose={resetForm} aria-labelledby="modal-title">
                    <Box sx={modalStyle}>
                        <Typography id="modal-title" variant="h6" fontWeight="bold">
                            {isEditing ? "Edit Task" : "Add Task"}
                        </Typography>
                        <FormControl fullWidth sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                name="title"
                                value={task.title}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Description"
                                required
                                multiline
                                rows={3}
                                variant="outlined"
                                name="description"
                                value={task.description}
                                onChange={handleChange}
                                fullWidth
                            />
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select name="priority" value={task.priority} onChange={handleChange} required>
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select name="status" value={task.status} onChange={handleChange} required>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="InProgress">In Progress</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="success" fullWidth onClick={handleSubmit}>
                                {isEditing ? "Update Task" : "Save Task"}
                            </Button>
                        </FormControl>
                    </Box>
                </Modal>
            </div>
        </DndProvider>
    );
}