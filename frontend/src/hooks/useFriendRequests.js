import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import useAuthUser from "./useAuthUser";

const useFriendRequests = () => {
  const { authUser } = useAuthUser();

  const { data: friendRequests, isLoading, error } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: !!authUser, // Only fetch if user is logged in
    refetchInterval: 1000 * 60, // Refetch every minute as a simple way to keep it fresh
  });

  const incomingCount = friendRequests?.incomingReqs?.length || 0;
  const acceptedCount = friendRequests?.acceptedReqs?.length || 0;

  return {
    friendRequests,
    incomingCount,
    acceptedCount,
    isLoading,
    error,
  };
};

export default useFriendRequests;
