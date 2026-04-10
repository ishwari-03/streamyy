import { Link } from "react-router";
import { getLanguageFlag } from "../lib/languageUtils";
import { Trash2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfriend } from "../lib/api";
import toast from "react-hot-toast";

const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient();

  const { mutate: unfriendMutation, isPending } = useMutation({
    mutationFn: () => unfriend(friend._id),
    onSuccess: () => {
      toast.success("Friend removed");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresh recommendations
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove friend");
    },
  });

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow group">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={
                friend.profilePic ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${friend.fullname}`
              }
              alt={friend.fullname}
            />
          </div>
          <h3 className="font-semibold truncate flex-1">{friend.fullname}</h3>
          
          <button 
            className="btn btn-ghost btn-xs btn-circle text-error opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              if (window.confirm(`Are you sure you want to remove ${friend.fullname} from your friends?`)) {
                unfriendMutation();
              }
            }}
            disabled={isPending}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {friend.nativelanguage && (
            <span className="badge badge-secondary text-xs flex items-center gap-1">
              {getLanguageFlag(friend.nativelanguage)}
              Native: {friend.nativelanguage}
            </span>
          )}

          {friend.learninglanguage && (
            <span className="badge badge-outline text-xs flex items-center gap-1">
              {getLanguageFlag(friend.learninglanguage)}
              Learning: {friend.learninglanguage}
            </span>
          )}
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline btn-sm w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
