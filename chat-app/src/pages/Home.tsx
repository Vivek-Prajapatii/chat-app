import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import "../styles/pages/Home.scss";
import View from "../components/View";
import { MessageModel } from "../models/MessageModel";

function Home() {
  const baseUrl = `${process.env.REACT_APP_API_URL}`;
  const authorization = `${process.env.REACT_APP_AUTHORIZATION}`;
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [send, setSend] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<string>("");
  const [deleteMsg, setDeleteMsg] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [deleteAllMsgs, setDeleteAllMsgs] = useState<boolean>(false);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [checkedMessages, setCheckedMessages] = useState<MessageModel[]>([]);

  // for sending (posting the messages)
  useEffect(() => {
    // creating payload to send
    const payload = { text: messageToSend };
    // using IIFE (immediately invoked function expression) function here
    send &&
      messageToSend &&
      (async function () {
        await fetch(baseUrl, {
          method: "post",
          headers: new Headers({
            Authorization: authorization,
            "Content-Type": "application/json",
          }),
          // body: payload,
          body: `${JSON.stringify(payload)}`,
        })
          .then(async (response) => {
            setSend(false);
            setRefetch(true);
            setMessageToSend("");
            console.log(await response.json());
          })
          .catch((error) => {
            setSend(false);
            console.log(error);
          });
      })();
  }, [send]);

  // for fetching all the messages
  useEffect(() => {
    // using IIFE (immediately invoked function expression) function here
    (async function () {
      await fetch(baseUrl, {
        method: "get",
        headers: new Headers({
          Authorization: authorization,
        }),
      })
        .then(async (result) => {
          setMessages(await result.json());
          setRefetch(false);
        })
        .catch((error) => {
          setRefetch(false);
          console.log(error);
        });
    })();
  }, [refetch]);

  // for deleting the messages
  useEffect(() => {
    deleteMsg &&
      messageId &&
      (async function () {
        await fetch(`${baseUrl}${messageId}/`, {
          method: "Delete",
          headers: new Headers({
            Authorization: authorization,
            "Content-Type": "application/json",
          }),
        })
          .then(async (response) => {
            setDeleteMsg(false);
            setMessageId("");
            setRefetch(true);
            console.log(await response.json());
          })
          .catch((error) => {
            setDeleteMsg(false);
            setMessageId("");
            console.log(error);
          });
      })();
  }, [deleteMsg]);

  // for deleting multiple messages at a single time
  useEffect(() => {
    if (deleteAllMsgs && checkedMessages.length > 0) {
      (async function () {
        const result = checkedMessages.map(async (messages, index) => {
          await fetch(`${baseUrl}${messages.id}/`, {
            method: "Delete",
            headers: new Headers({
              Authorization: authorization,
              "Content-Type": "application/json",
            }),
          })
            .then(() => {
              // fetching the latest list of messages

              if (index === checkedMessages.length - 1) {
                console.log(index, checkedMessages.length - 1);
                setRefetch(true);
                setCheckedMessages([]);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });

        if (result) {
          setDeleteAllMsgs(false);
        }
      })();
    }
  }, [deleteAllMsgs]);

  return (
    <div className="home">
      <h1>Chatter</h1>
      <div className="input">
        <Input
          setSend={setSend}
          setMessageToSend={setMessageToSend}
          messageToSend={messageToSend}
        />
      </div>
      <div className="view">
        <View
          messages={messages}
          setDeleteMsg={setDeleteMsg}
          setMessageId={setMessageId}
          setDeleteAllMsgs={setDeleteAllMsgs}
          deleteAllMsgs={deleteAllMsgs}
          setCheckedMessages={setCheckedMessages}
          checkedMessages={checkedMessages}
        />
      </div>
    </div>
  );
}

export default Home;
