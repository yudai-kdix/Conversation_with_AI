// src/ChatBubble.js
import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ChatBubble = ({ text, align, type }) => {
  const isLeft = align === "left";
  const backgroundColor = type === "request" ? "#2196f3" : "#f5f5f5";
  const textColor = type === "request" ? "white" : "black";

  return (
    <Box
      display="flex"
      justifyContent={isLeft ? "flex-start" : "flex-end"}
      my={1}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: backgroundColor,
          color: textColor,
          maxWidth: "70%",
        }}
      >
        <Typography variant="body1">{text}</Typography>
      </Paper>
    </Box>
  );
};

export default ChatBubble;
