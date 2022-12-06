import React from "react";
import Message from "./Message";

const Send = ({ text, userName, userPhoto }) => {
  return (
    <div>
      <Message
        text={text}
        userName={userName}
        userPhoto={userPhoto}
        right={true}
      />
    </div>
  );
};

export default Send;
