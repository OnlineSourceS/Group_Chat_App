import React from "react";

const Message = ({ text, userName, userPhoto, right }) => {
  // console.log(userPhoto)
  return (
    <div
      className={`rounded-lg ${
        right ? "rounded-br-none" : "rounded-bl-none"
      } m-1 ${right ? "bg-green-300" : "bg-white"} ${
        right ? "ml-auto" : ""
      } w-[12rem] `}
    >
      <div
        className={`flex flex-col shadow-md ${
          right ? "rounded-bl-lg" : "rounded-br-lg"
        } `}
      >
        <div className="rounded-t-lg px-1 py-0.5 flex items-center bg-[#0000000c] hover:bg-[#00000015] cursor-pointer ease-out">
          {/* {userPhoto ? <img 
          src={userPhoto}
          className="rounded-full w-3 mr-1"
          alt="Avatar"
          /> : <></>} */}
          <a href={userPhoto} target={"_blank"}>
            <h4
              title={"User: 🟢 " + userName}
              className="text-[0.56rem] font-bold"
            >
              {userName}
            </h4>
          </a>
        </div>
        <p className="break-words text-start font-[300] text-[0.65rem] p-1.5 py-1 leading-[0.8rem]">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Message;
