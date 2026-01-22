import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../Lib/utils";
import { ChatContext } from "../../context/chatContext.jsx";
import { AuthContext } from "../../context/authContext.jsx";
import toast from "react-hot-toast";

export const ChatContainer = () => {
  const scrollEnd = useRef(null);

  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");

  /* ---------------- SEND TEXT MESSAGE ---------------- */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  /* ---------------- SEND IMAGE ---------------- */
  const handleSendImage = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  /* ---------------- FETCH MESSAGES ---------------- */
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const imageInputId = `image-${selectedUser?._id}`;

  /* ===================== UI ===================== */
  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden max-w-7 cursor-pointer"
        />

        <img
          src={assets.help_icon}
          alt="help"
          className="max-md:hidden max-w-5"
        />
      </div>

      {/* ---------- CHAT AREA ---------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === authUser._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "flex-row-reverse justify-end"
              }`}
            >
              {/* MESSAGE */}
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[230px] border border-gray-700
                  rounded-lg overflow-hidden mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light
                  rounded-lg mb-8 break-all bg-violet-500/30 text-white
                  ${isMe ? "rounded-br-none" : "rounded-bl-none"}`}
                >
                  {msg.text}
                </p>
              )}

              {/* AVATAR + TIME */}
              <div className="text-center text-xs">
                <img
                  src={
                    isMe
                      ? authUser.profilePic || assets.avatar_icon
                      : selectedUser.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* ---------- BOTTOM INPUT ---------- */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" ? handleSendMessage(e) : null
            }
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none
            text-white placeholder-gray-400 bg-transparent"
          />

          <input
            type="file"
            id={imageInputId}
            accept="image/png, image/jpeg"
            hidden
            onChange={handleSendImage}
          />

          <label htmlFor={imageInputId}>
            <img
              src={assets.gallery_icon}
              alt="gallery"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          src={assets.send_button}
          onClick={handleSendMessage}
          alt="send"
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2
    text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">
        Chat anytime, anywhere
      </p>
    </div>
  );
};
