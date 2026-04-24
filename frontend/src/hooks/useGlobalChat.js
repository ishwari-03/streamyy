import { useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import useAuthUser from "./useAuthUser";
import { getStreamToken } from "../lib/api";
import toast from "react-hot-toast";
import { useChatNotificationsStore } from "../store/useChatNotificationsStore";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useGlobalChat = () => {
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let client;
    let handleNewMessage;
    
    const initGlobalListener = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        client = StreamChat.getInstance(STREAM_API_KEY);
        
        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullname,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        // Fetch initial unread channels
        try {
          const channels = await client.queryChannels(
            { members: { $in: [authUser._id] } },
            [{ last_message_at: -1 }],
            { watch: true, state: true }
          );

          let initialUnreadMsgs = [];
          channels.forEach(c => {
            const count = c.countUnread();
            if (count > 0 && c.state.messages.length > 0) {
              const lastMsg = c.state.messages[c.state.messages.length - 1];
              if (lastMsg.user.id !== authUser._id) {
                initialUnreadMsgs.push({ ...lastMsg, channelId: c.id });
              }
            }
          });
          useChatNotificationsStore.getState().setUnreadMessages(initialUnreadMsgs);
        } catch (err) {
          console.error("Error fetching unread channels:", err);
        }

        handleNewMessage = (event) => {
          if ((event.type === 'message.new' || event.type === 'notification.message_new') && event.message.user.id !== authUser._id) {
            const currentPath = window.location.pathname;
            
            // Add to the store to show in notifications page
            useChatNotificationsStore.getState().addUnreadMessage({
               ...event.message,
               channelId: event.channel_id
            });

            if (!currentPath.includes(`/chat/${event.message.user.id}`)) {
               toast.success(`💬 New message from ${event.message.user.name || 'someone'}: ${event.message.text.substring(0, 30)}`);
               
               // Attempt to play a notification sound
               try {
                 const audio = new Audio('/notification.mp3'); // Fallback if file exists
                 audio.play().catch(e => console.log('Audio play ignored'));
               } catch (e) {}
            }
          }
        };

        const handleMessageRead = (event) => {
           // event is type: 'message.read'
           // It means the user read messages in a channel.
           // Since we map unread by user id, we can try to guess it from channel id, or simply requery.
           useChatNotificationsStore.getState().clearUnreadForUser(event.user.id);
        };

        client.on('message.new', handleNewMessage);
        client.on('notification.message_new', handleNewMessage);
        client.on('message.read', handleMessageRead);
      } catch (error) {
        console.error("Global Chat Initialization Error:", error);
      }
    };

    initGlobalListener();
    
    return () => {
      if (client) {
        if (handleNewMessage) {
          client.off('message.new', handleNewMessage);
          client.off('notification.message_new', handleNewMessage);
        }
        // we could off message.read too if we had a dedicated handler reference
      }
    };
  }, [tokenData, authUser]);

  return null;
};
