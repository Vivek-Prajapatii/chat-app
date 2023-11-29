import React from "react";
import { Button, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "../styles/components/Input.scss";

function Input(props: {
  setSend: Function;
  setMessageToSend: Function;
  messageToSend: string;
}) {
  const { setSend, setMessageToSend, messageToSend } = props;

  return (
    <div className="input-wrapper">
      <TextField
        className="text-field"
        variant="outlined"
        multiline
        maxRows={3}
        placeholder="Type your message here..."
        value={messageToSend}
        onChange={(event) => {
          setMessageToSend(event.target.value);
        }}
      />
      <Button
        sx={{ height: "3.5rem", ml:"1rem", fontSize:"20px" }}
        variant={"contained"}
        onClick={() => {
          messageToSend && setSend(true);
        }}
        endIcon={<SendIcon sx={{ width: "1.5rem", height: "1.5rem" }} />}
      >
        Post
      </Button>
    </div>
  );
}

export default Input;
