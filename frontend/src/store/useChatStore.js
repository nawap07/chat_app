import { create } from "zustand";
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStores } from "./useAuthStore"

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selecteUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUser: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { messages, selecteUser } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selecteUser._id}`, messageData);
            set({ messages: [...messages, res.data] })
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages: () => {
        const { selecteUser } = get();

        if (!selecteUser) return;

        const socket = useAuthStores.getState().socket;
        socket.on("newMessage", (newMessage) => {
            const isMessageeSentFromSelectedUser =newMessage.senderId === selecteUser._id;
            if(!isMessageeSentFromSelectedUser) return;
            set({ messages: [...get().messages, newMessage] })
        })

    },
    unsubscribeToMessage: () => {
        const socket = useAuthStores.getState().socket;
        socket.off("newMessage")
    },
    setSelectedUser: (selecteUser) => set({ selecteUser }),

}));