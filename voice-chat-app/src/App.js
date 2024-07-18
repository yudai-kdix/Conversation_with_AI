// src/App.js
import React, { useState } from "react";
import Recorder from "./Recorder";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Collapse,
} from "@mui/material";
import ChatBubble from "./ChatBubble";

const App = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [audioURL, setAudioURL] = useState("");
  const [useFastEndpoint, setUseFastEndpoint] = useState(false);
  const [logOpen, setLogOpen] = useState(false); // 追加

  const handleStop = (blob) => {
    setAudioBlob(blob);
    handleSend(blob);
  };

  const handleSend = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "recording.wav");

    const endpoint = useFastEndpoint
      ? "http://127.0.0.1:5000/chat_fast"
      : "http://127.0.0.1:5000/chat";

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { message, request_text, chat_text, file_path } = response.data;
      setStatusMessage(message);

      // リクエストとチャットのテキストを交互に履歴に追加
      setMessageHistory((prev) => [
        ...prev,
        { text: request_text, align: "right", type: "request" },
        { text: chat_text, align: "left", type: "response" },
      ]);

      // 音声ファイルを取得して再生
      const audioResponse = await axios.get(
        `http://127.0.0.1:5000/voice?file=${file_path}`,
        {
          responseType: "blob",
        }
      );
      const audioURL = URL.createObjectURL(audioResponse.data);
      setAudioURL(audioURL);
    } catch (error) {
      setStatusMessage("Error sending audio to backend");
      console.error("Error sending audio to backend:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Voice Chat App
      </Typography>
      <Recorder
        onStop={handleStop}
        useFastEndpoint={useFastEndpoint}
        setUseFastEndpoint={setUseFastEndpoint}
      />
      <Typography variant="body1" color="textSecondary" gutterBottom>
        {statusMessage}
      </Typography>
      {audioURL && <audio controls src={audioURL} />}
      <br />
      <Button
        variant="contained"
        onClick={() => setLogOpen(!logOpen)}
        sx={{ mb: 2 }}
      >
        {logOpen ? "Hide Log" : "Show Log"}
      </Button>
      <Collapse in={logOpen}>
        <Box sx={{ my: 2 }}>
          <Card variant="outlined">
            <CardContent>
              {messageHistory.map((message, index) => (
                <ChatBubble
                  key={index}
                  text={message.text}
                  align={message.align}
                  type={message.type}
                />
              ))}
            </CardContent>
          </Card>
        </Box>
      </Collapse>
    </Container>
  );
};

export default App;
