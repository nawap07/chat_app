import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStores } from '../store/useAuthStore';
import { formatMessage } from '../lib/utils';

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selecteUser, subscribeToMessages, unsubscribeToMessage } = useChatStore();
    const { authUser } = useAuthStores();
    const messagenRef = useRef(null)

    useEffect(() => {
        getMessages(selecteUser._id)

        subscribeToMessages()

        return () => unsubscribeToMessage();
    }, [selecteUser._id, getMessages, subscribeToMessages, unsubscribeToMessage]);

    useEffect(() => {
        if (messagenRef.current && messages) {
            messagenRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])
    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }
    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {
                    messages.map((message) => (
                        <div key={message._id}
                            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                            ref={messagenRef}
                        >
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img
                                        src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selecteUser.profilePic || "/avatar.png"}
                                        alt="profile Pic" />
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className='text-xs opacity-50 ml-1'>
                                    {formatMessage(message.createdAt)}
                                </time>
                            </div>
                            <div className="chat-bubble flex relative flex-col">
                                {
                                    message.image && (
                                        <img
                                            src={message.image}
                                            alt='Attachment'
                                            className='sm:max-w-[200px] rounded-md mb-2'
                                        />
                                    )
                                }
                                {
                                    message.text && <p className=''>{message.text}</p>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            <MessageInput />
        </div>
    )
}

export default ChatContainer