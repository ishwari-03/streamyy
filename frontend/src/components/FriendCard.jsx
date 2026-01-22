import { Link } from "react-router";
import { getLanguageFlag } from "../lib/languageUtils";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 rounded-full">
            <img
              src={
                friend.profilePic ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${friend.fullname}`
              }
              alt={friend.fullname}
            />
          </div>
          <h3 className="font-semibold truncate">{friend.fullname}</h3>
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

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
