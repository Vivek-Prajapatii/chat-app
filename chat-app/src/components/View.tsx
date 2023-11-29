import React, { useEffect, useState } from "react";
import "../styles/components/View.scss";
import {
  Avatar,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "../utils/formatDate.util";
import { MessageModel } from "../models/MessageModel";
import Modal from "./modal/Modal";

function View(props: {
  messages: MessageModel[];
  setDeleteMsg: Function;
  setMessageId: Function;
  setDeleteAllMsgs: Function;
  deleteAllMsgs: boolean;
  setCheckedMessages: Function;
  checkedMessages: MessageModel[];
}) {
  const {
    messages,
    setDeleteMsg,
    setMessageId,
    setDeleteAllMsgs,
    deleteAllMsgs,
    setCheckedMessages,
    checkedMessages,
  } = props;
  const [sortedMessages, setSortedMessages] = useState<any>();
  const [sort, setSort] = useState<string>("Newer");
  const [appearCheckbox, setAppearCheckbox] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);

  // handles the checkbox clicks
  const handleCheckboxChange = (message: MessageModel) => {
    const index = checkedMessages?.findIndex(
      (checkedItem: MessageModel) => checkedItem.id === message.id
    );

    if (index === -1) {
      // If the item is not in the array, add it
      setCheckedMessages([...checkedMessages, message]);
    } else {
      // If the item is already in the array, remove it
      const updatedItems = [...checkedMessages];
      updatedItems.splice(index, 1);
      setCheckedMessages(updatedItems);
    }
  };

  // sorting the messages
  useEffect(() => {
    (function () {
      if (sort === "Newer") {
        const copiedArray =
          messages && JSON.parse(JSON.stringify(messages));
        messages &&
          setSortedMessages(
            copiedArray.sort((a: any, b: any) =>
              b.timestamp.localeCompare(a.timestamp)
            )
          );
      } else {
        setSortedMessages(messages);
      }
    })();
  }, [messages, sort]);

  // callback for on cancel click on modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // callback for on yes click on modal
  const handleYesClick = () => {
    setModalOpen(false);
    setDeleteAllMsgs(true);
    setAppearCheckbox(false);
  };

  if (isModalOpen) {
    const message = "Are you sure you want to delete the selected messages?";
    const yesPlaceholder = "Delete";

    return (
      <>
        <Modal
          message={message}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onYes={handleYesClick}
          yesPlaceholder={yesPlaceholder}
          noPlaceholder="Cancel"
        />
      </>
    );
  }

  return (
    <div className="view">
      <div className="delete-all-stack">
        <div>
          <Button
            variant={"outlined"}
            onClick={() => {
              setCheckedMessages([]);
              setAppearCheckbox(!appearCheckbox);
            }}
          >
            Select
          </Button>
        </div>
        <div>
          <FormControl sx={{ width: "6rem" }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Sort By
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              label={"Sort By"}
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
              }}
              autoWidth
              sx={{ height: "2rem" }}
            >
              <MenuItem value={"Newer"}>Newer</MenuItem>
              <MenuItem value={"Older"}>Older</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant={"outlined"}
            sx={{ color: "red", borderColor: "red", ml: 1 }}
            onClick={() => {
              checkedMessages?.length > 0 && setModalOpen(true);
            }}
          >
            Delete All
          </Button>
        </div>
      </div>
      {sortedMessages &&
        sortedMessages?.map((message: MessageModel) => {
          return (
            <div className="view-box" key={message.id}>
              <div className="avatar">
                {!appearCheckbox ? (
                  <Avatar
                    sx={{ bgcolor: "grey" }}
                    alt={message.source}
                    src="/broken-image.jpg"
                  />
                ) : (
                  <>
                    <Checkbox
                      checked={checkedMessages.some(
                        (checkedItem: MessageModel) =>
                          checkedItem.id === message.id
                      )}
                      onChange={() => handleCheckboxChange(message)}
                    />
                  </>
                )}
              </div>
              <div className="message">
                <div className="name">
                  <h4>{message?.source}</h4>
                  <h6>~{formatDate(message?.timestamp)}</h6>
                </div>
                <span>{message?.text}</span>
              </div>
              <div>
                {!appearCheckbox && (
                  <IconButton
                    onClick={() => {
                      setDeleteMsg(true);
                      setMessageId(message?.id);
                    }}
                  >
                    <DeleteIcon
                      sx={{ width: "1.7rem", height: "1.7rem", color: "red" }}
                    />
                  </IconButton>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default View;
