import React from "react";
import Message from "./Message";

const Receive = ({ text, userName, userPhoto }) => {
  return (
    <div>
      <Message
        text={text}
        userName={userName}
        userPhoto={userPhoto}
        right={false}
      />
    </div>
  );
};

export default Receive;
