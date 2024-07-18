// src/Recorder.js
import React, { useState, useRef } from "react";
import { Button, Box, FormControlLabel, Checkbox } from "@mui/material";

const Recorder = ({ onStop, useFastEndpoint, setUseFastEndpoint }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        onStop(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="contained"
          color={recording ? "secondary" : "primary"}
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={useFastEndpoint}
              onChange={() => setUseFastEndpoint(!useFastEndpoint)}
            />
          }
          label="Use Groq"
          sx={{ ml: 2 }}
        />
      </Box>
    </Box>
  );
};

export default Recorder;
