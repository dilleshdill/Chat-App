import  { React,useContext,useState } from 'react'
import { ChatContainer } from '../Components/ChatContainer.jsx'
import { Sidebar } from '../Components/Sidebar.jsx'
import { RightSidebar } from '../Components/RightSidebar.jsx'
import { ChatContext } from '../../context/chatContext.jsx'
export const HomePage = () => {

    const {selectedUser} = useContext(ChatContext)
  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
        <div
            className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl
            overflow-hidden h-full grid grid-cols-1 relative
            ${
            selectedUser
                ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
                : "md:grid-cols-2"
            }`}
        >

            <Sidebar />
            <ChatContainer />
            <RightSidebar />
        </div>
    </div>
  )
}
