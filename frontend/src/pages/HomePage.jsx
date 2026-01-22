import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { capitialize } from "../lib/utils";
import useAuthUser from "../hooks/useAuthUser";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  const { authUser, isLoading: loadingAuthUser } = useAuthUser();

  const outgoingRequestsIds = new Set();
  if (Array.isArray(outgoingFriendReqs)) {
    outgoingFriendReqs.forEach((req) => {
      if (req?.recipient?._id) {
        outgoingRequestsIds.add(req.recipient._id);
      }
    });
  }


  return (

    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">

        {/* ===== YOUR PROFILE SUMMARY (TOP SECTION) ===== */}
{/* ===== YOUR PROFILE SUMMARY (TOP SECTION) ===== */}
{/* ===== YOUR PROFILE SUMMARY (TOP SECTION) ===== */}
{!loadingAuthUser && authUser && (
  <div className="card bg-base-200 shadow-md">
    <div className="card-body p-6">
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="avatar">
          <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={
                authUser.profilepic ||
                authUser.profilePic ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser.fullname}`
              }
              alt={authUser.fullname}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {authUser.fullname}
          </h1>

          {authUser.bio && (
            <p className="text-sm opacity-70 mt-1 max-w-xl">
              {authUser.bio}
            </p>
          )}

          {/* Languages — SAME STYLE AS FRIENDS */}
          <div className="flex flex-wrap gap-2 mt-3">
            {authUser.nativelanguage && (
              <span className="badge badge-primary badge-outline px-3 py-2 text-xs font-medium flex items-center gap-1">
                Native · {capitialize(authUser.nativelanguage)}
              </span>
            )}

            {authUser.learninglanguage && (
              <span className="badge badge-accent badge-outline px-3 py-2 text-xs font-medium flex items-center gap-1">
                Learning · {capitialize(authUser.learninglanguage)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}



        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-4">
  <div className="avatar">
    <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
      <img
        src={
          user.profilepic ||
          user.avatar ||
          `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.fullname}`
        }
        alt={user.fullname}
      />
    </div>
  </div>

  <div>
    <h3 className="font-semibold text-lg">{user.fullname}</h3>

    {user.location && (
      <div className="flex items-center text-xs opacity-70 mt-1">
        <MapPinIcon className="size-3 mr-1" />
        {user.location}
      </div>
    )}
  </div>
</div>

{/* Languages */}
<div className="flex flex-wrap gap-2">
  {user.nativelanguage && (
    <span className="badge badge-primary badge-outline px-3 py-2 text-xs font-medium flex items-center gap-1">
       Native · {capitialize(user.nativelanguage)}
    </span>
  )}

  {user.learninglanguage && (
    <span className="badge badge-accent badge-outline px-3 py-2 text-xs font-medium flex items-center gap-1">
       Learning · {capitialize(user.learninglanguage)}
    </span>
  )}
</div>



                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;