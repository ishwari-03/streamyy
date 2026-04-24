import { create } from "zustand";

export const useChatNotificationsStore = create((set) => ({
  unreadCount: 0,
  unreadMessages: [],
  
  setUnreadCount: (count) => set({ unreadCount: count }),
  setUnreadMessages: (messages) => set({ unreadMessages: messages }),
  
  addUnreadMessage: (message) => set((state) => {
    // Filter out previous messages from the same user to just show latest
    const filtered = state.unreadMessages.filter(m => m.user.id !== message.user.id);
    return { 
      unreadMessages: [message, ...filtered],
      unreadCount: state.unreadCount + 1 
    };
  }),

  clearUnreadForUser: (userId) => set((state) => ({
    unreadMessages: state.unreadMessages.filter(m => m.user.id !== userId),
    // we don't precisely know how many messages were from this user without counting,
    // so we'll just recalculate based on remaining messages
    unreadCount: state.unreadMessages.filter(m => m.user.id !== userId).length
  }))
}));
