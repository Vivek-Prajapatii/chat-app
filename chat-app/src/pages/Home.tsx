import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import "../styles/pages/Home.scss";
import View from "../components/View";

function Home() {
  const [messages, setMessages] = useState<any>();
  const [send, setSend] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<string>("");
  const [deleteMsg, setDeleteMsg] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [deleteAllMsgs, setDeleteAllMsgs] = useState<boolean>(false);
  const [messageToSend, setMessageToSend] = useState<string>("");

  // for sending (posting the messages)
  useEffect(() => {
    // creating payload to send
    const payload = { text: messageToSend };
    // using IIFE (immediately invoked function expression) function here
    send &&
      messageToSend &&
      (async function () {
        await fetch("https://mapi.harmoney.dev/api/v1/messages/", {
          method: "post",
          headers: new Headers({
            Authorization: "80-HrES6L-BjwyRt",
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
      await fetch("https://mapi.harmoney.dev/api/v1/messages/", {
        method: "get",
        headers: new Headers({
          Authorization: "80-HrES6L-BjwyRt",
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
        await fetch(`https://mapi.harmoney.dev/api/v1/messages/${messageId}/`, {
          method: "Delete",
          headers: new Headers({
            Authorization: "80-HrES6L-BjwyRt",
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
        />
      </div>
    </div>
  );
}

export default Home;
