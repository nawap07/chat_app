import React from 'react'
import { useChatStore } from '../store/useChatStore'
import SideBar from '../components/SideBar';
import NoChatSelecte from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';

const Home = () => {
  const {selecteUser } = useChatStore();
  return (
    <div className='h-screen bg-base-200 '>
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] ">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SideBar />
            {
              !selecteUser ? <NoChatSelecte /> : <ChatContainer />
            }
          </div>
        </div>

      </div>


    </div>
  )
}

export default Home