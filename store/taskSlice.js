import { createSlice } from "@reduxjs/toolkit";

const loadTasks = () => {
    if (typeof window !== "undefined") {
        const storedTasks = localStorage.getItem("tasks");
        return storedTasks ? JSON.parse(storedTasks) : [];
    }
    return []; // Return an empty array during SSR
};

const initialState = {
    tasks: loadTasks(),
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.tasks.push(action.payload);
            if (typeof window !== "undefined") {
                localStorage.setItem("tasks", JSON.stringify(state.tasks
                ));
            }
        },
        removeTask: (state, action) => {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            if (typeof window !== "undefined") {
                localStorage.setItem("tasks", JSON.stringify(state.tasks));
            }
        },
        updateStatus: (state, action) => {
            const index = state.tasks.findIndex((task) => task.id === action.payload.id);
            console.log(index)
            if (index !== -1) {
                state.tasks[index] = {
                    ...state.tasks[index],
                    status: action.payload.status
                };
                localStorage.setItem("tasks", JSON.stringify(state.tasks));
            }
        },
        editTask: (state, action) => {
            const index = state.tasks.findIndex((task) => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
                localStorage.setItem("tasks", JSON.stringify(state.tasks));
            }
        },
    },
});

export const { addTask, removeTask, editTask, updateStatus } = taskSlice.actions;
export default taskSlice.reducer;
