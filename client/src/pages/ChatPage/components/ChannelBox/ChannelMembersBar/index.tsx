import { HTMLProps, useEffect, useState } from "react";
import {
  ParticipantType,
  UserStatus,
  UserType,
} from "../../../../../constants";
import { useChatContext } from "../context";
import {
  PopupMenu,
  PopupMenuDivider,
  PopupMenuProvider,
  PopupMenuTrigger,
} from "../../../../../modals/DefaultPopupMenu";
import {
  ContextMenu,
  ContextMenuProvider,
  ContextMenuTrigger,
} from "../../../../../modals/ContextMenu";
import PopupMenuItem from "../ChannelRoomsBar/components/PopupMenuItem";
import {
  getDividerDateFormat,
  toDateStr,
} from "../../../../../common/DateUtils";

type GroupType = {
  name: string;
  participants: ParticipantType[];
};

const groupMembersByRole = (list: ParticipantType[]): GroupType[] => {
  const priorityMap: { [key: string]: number | undefined } = {
    Member: 1,
    Offline: 2,
  };

  list.sort((a, b) => {
    const nameA: string = a.user.profile.full_name;
    const nameB: string = b.user.profile.full_name;

    return nameA.localeCompare(nameB);
  });

  const reduced = list.reduce(
    (previous, participant) => {
      let group = participant.user.profile.status;

      if (group !== "Offline") {
        if (participant.role) group = participant.role.name;
        else group = "Member";
      }

      if (!previous[group]) previous[group] = [];
      previous[group].push(participant);

      return previous;
    },
    {} as { [key: string]: Array<ParticipantType> }
  );

  const result = Object.entries(reduced)
    .map(([name, participants]) => ({
      name,
      participants,
    }))
    .sort((a, b) => {
      const priorityA = priorityMap[a.name] || 0;
      const priorityB = priorityMap[b.name] || 0;

      return priorityA - priorityB;
    });

  return result;
};

const ChannelMembersBar = () => {
  const { users } = useChatContext();
  const [members, setMembers] = useState<GroupType[]>([]);

  useEffect(() => {
    setMembers(groupMembersByRole(users));
  }, [users]);

  return (
    <div className="w-80 h-full overflow-y-auto bg-gray-800">
      {members.map((group: GroupType) => (
        <MemberContainer key={group.name} group={group} />
      ))}
    </div>
  );
};

const MemberContainer = ({ group }: { group: GroupType }) => {
  return (
    <div className="my-4 mx-3">
      <Title role={group.name} userCount={group.participants.length} />
      {group.participants.map((participant: ParticipantType) => (
        <Member key={participant.id} user={participant.user} />
      ))}
    </div>
  );
};

const Title = ({ role, userCount }: { role: string; userCount: number }) => {
  return (
    <span
      className="w-80 h-full text-gray-500 opacity-90 text-sm 
        font-semibold uppercase pl-2"
    >
      {role} — {userCount}
    </span>
  );
};

const Member = ({ user }: { user: UserType }) => {
  return (
    <ContextMenuProvider arrowEnabled={false}>
      <PopupMenuProvider>
        <PopupMenuTrigger fixed>
          <ContextMenuTrigger asChild>
            <div
              className="flex flex-row py-1 px-2 my-0.5 cursor-pointer rounded-md
                        hover:bg-gray-700 transition ease-out duration-300 select-none relative"
            >
              <div
                className="w-10 min-w-[40px] h-full self-center mr-2 rounded-full 
                           shadow-lg overflow-hidden"
              >
                <img
                  src={user.profile.icon}
                  draggable={false}
                  className="object-cover opacity-90"
                />
              </div>
              <OnlineStatusCircle status={user.profile.status} />
              <h5
                className="text-base self-center text-gray-400 opacity-80 overflow-hidden 
                            whitespace-nowrap text-ellipsis transition ease-out duration-300 select-none"
              >
                {user.profile.full_name}
              </h5>
            </div>
          </ContextMenuTrigger>
        </PopupMenuTrigger>
        <MemberPopupMenu user={user} />
        <MemberContextMenu />
      </PopupMenuProvider>
    </ContextMenuProvider>
  );
};

const MemberPopupMenu = ({ user }: { user: UserType } & HTMLProps<Element>) => {
  return (
    <PopupMenu className="flex flex-col w-[25vw] h-[95vh] rounded-[4px] border-4 border-gray-900">
      <Wallpaper wallpaper={user.profile.wallpaper} />
      <ContentWrapper user={user} />
    </PopupMenu>
  );
};

const ContentWrapper = ({ user }: { user: UserType }) => (
  <div className="relative w-full h-full bg-gray-800">
    <UserIcon icon={user.profile.icon} />
    <UserCard user={user} />
  </div>
);

const Wallpaper = ({ wallpaper }: { wallpaper: string }) => (
  <div className="w-full aspect-[5/2] shrink-0 rounded-t-[4px] overflow-hidden">
    <img src={wallpaper} className="object-cover" />
  </div>
);

const UserIcon = ({ icon }: { icon: string }) => (
  <div
    className="flex absolute -top-[4vw] left-[1vw] w-[8vw] h-[8vw] rounded-full 
    bg-gray-950 overflow-hidden items-center justify-center border-[6px] border-gray-800"
  >
    <img src={icon} className="w-full h-full rounded-full" />
  </div>
);

const UserCard = ({ user }: { user: UserType }) => (
  <div
    className="flex flex-col w-[90%] h-[80%] bg-gray-950 rounded-[4px]
    m-4 mt-16 p-3"
  >
    <UserCardTitle username={user.username} fullName={user.profile.full_name} />
    <UserCardDivider className="mt-2" />
    <div className="flex flex-col h-full w-full pt-2 custom-overflow-y-auto-scroll">
      <UserCardBio bio={user.profile.bio} className="mb-4" />
      <UserCardMemberSince date={user.profile.date_joined} className="mb-4" />
      <UserCardRoles className="mb-4" />
      <UserCardNote />
      <UserCardMessageInput user={user} className="mt-auto" />
    </div>
  </div>
);

const UserCardTitle = ({
  username,
  fullName,
  ...props
}: { username: string; fullName: string } & HTMLProps<HTMLDivElement>) => (
  <div className="flex flex-col text-white font-sans text-sm" {...props}>
    <h1 className="text-lg">{fullName}</h1>
    <h1 className="">{username}</h1>
  </div>
);

const UserCardDivider = ({ ...props }: HTMLProps<HTMLDivElement>) => (
  <div
    className="h-0 w-full border border-b-0 border-gray-700 mt-2"
    {...props}
  />
);

const UserCardBio = ({
  bio,
  ...props
}: { bio: string } & HTMLProps<HTMLDivElement>) =>
  bio ? (
    <div {...props}>
      <h1 className="text-white font-sans font-bold uppercase text-xs mb-1">
        About me
      </h1>
      <h1 className="text-white font-sans text-sm">{bio}</h1>
    </div>
  ) : (
    <></>
  );

const UserCardMemberSince = ({
  date,
  ...props
}: { date: string } & HTMLProps<HTMLDivElement>) => (
  <div {...props}>
    <h1 className="text-white font-sans font-bold uppercase text-xs mb-1">
      Member since
    </h1>
    <h1 className="text-white font-sans text-sm">
      {toDateStr(date, getDividerDateFormat)}
    </h1>
  </div>
);

const UserCardRoles = ({ ...props }: HTMLProps<HTMLDivElement>) => (
  <div {...props}>
    <h1 className="text-white font-sans font-bold uppercase text-xs mb-1">
      Roles
    </h1>
  </div>
);

const UserCardNote = ({ ...props }: HTMLProps<HTMLDivElement>) => (
  <div {...props}>
    <h1 className="text-white font-sans font-bold uppercase text-xs mb-1">
      Note
    </h1>
    <input
      className="text-white font-sans text-xs bg-transparent"
      placeholder="Click to add a note"
    ></input>
  </div>
);

const UserCardMessageInput = ({
  user,
  ...props
}: { user: UserType } & HTMLProps<HTMLDivElement>) => (
  <div {...props}>
    <div className="w-full bg-transparent border px-3 py-1.5 rounded-[4px]">
      <input
        className="text-white font-sans text-xs bg-transparent"
        placeholder={`Message @${user.username}`}
      ></input>
    </div>
  </div>
);

const MemberContextMenu = () => {
  return (
    <ContextMenu>
      <PopupMenuItem text="Profile" />
      <PopupMenuItem text="Message" disabled />
      <PopupMenuItem text="Call" disabled />
      <PopupMenuItem text="Add Note" disabled />
      <PopupMenuDivider />
      <PopupMenuItem text="Add Friend" />
      <PopupMenuItem text="Block" />
      <PopupMenuItem
        text="Report"
        color="text-red-500 enabled:hover:bg-red-500"
      />
    </ContextMenu>
  );
};

const OnlineStatusCircle = ({ status }: { status: string }) => {
  let circleClassName =
    "absolute min-w-[16px] w-4 h-4 top-8 left-8 \
    rounded-full border-[3px] border-gray-800";

  if (status === UserStatus.ONLINE) {
    circleClassName += " bg-green-500";
  } else if (status === UserStatus.SLEEPING) {
    circleClassName += " bg-yellow-500";
  } else if (status === UserStatus.BUSY) {
    circleClassName += " bg-red-500";
  } else {
    circleClassName += " bg-gray-500";
  }

  return <div className={circleClassName} />;
};

export default ChannelMembersBar;
