import React from 'react'
import { Box, Button, Typography, Container } from "@mui/material";
import Todo from './Todo';

const Hero = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                // background: "linear-gradient(to bottom right, #2196F3, #9C27B0)",
                color: "white",
                px: 4,
            }}
        >
            <Typography variant="h2" fontWeight="bold" gutterBottom className='pt-20'>
                Boost Your Productivity
            </Typography>
            <Typography variant="h6" maxWidth="sm" gutterBottom>
                Organize your tasks, set priorities, and track your progress effortlessly with our powerful to-do app.
            </Typography>
            <Todo />
            <Box position="relative" bottom={20} display="flex" gap={3} color="gray.300">
                <Typography variant="body2">✅ Task Management</Typography>
                <Typography variant="body2">🚀 Quick & Simple</Typography>
                <Typography variant="body2">🌟 Boost Efficiency</Typography>
            </Box>
        </Box>
    )
}

export default Hero