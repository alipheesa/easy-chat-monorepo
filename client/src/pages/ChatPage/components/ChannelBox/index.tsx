import ChannelMembersBar from "./ChannelMembersBar";
import ChannelRoomsBar from "./ChannelRoomsBar";
import NavigationTopBar from "./NavigationTopBar";
import ChatBox from "./ChatBox";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../../../../constants";
import { useChatContext } from "./context";
import { useWebSocketContext } from "../../context/WebsocketContext";

const ChannelBox = () => {
  const params = useParams();
  const { sendJsonMessage, lastJsonMessage } = useWebSocketContext();

  const {
    setTopics,
    setUsers,
    setMessages,
    setGroups,
    setCurrentGroup,
    currentRoom,
    setCurrentRoom,
  } = useChatContext();

  useEffect(() => {
    if (params.group_id === undefined) return;

    sendJsonMessage({
      type: "group.connect",
      group_id: params.group_id,
    });

    axios
      .post(
        API_URLS.api.JOIN_GROUP(params.group_id),
        {},
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === 200) {
          axios
            .get(API_URLS.api.GET_GROUP_LIST(), { withCredentials: true })
            .then((response) => {
              setGroups(response.data);
            })
            .catch(console.log);

          axios
            .get(API_URLS.api.GET_GROUP_DATA(params.group_id as string), {
              withCredentials: true,
            })
            .then(({ data }) => {
              setCurrentGroup({
                id: data.id,
                name: data.name,
                icon: data.icon,
                is_read: data.is_read,
              });
              setCurrentRoom(data.topics[0].rooms[0]);
              setTopics(data.topics);
              setUsers(data.participants);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params]);

  useEffect(() => {
    const type = lastJsonMessage?.type;
    if (type === "user.message") {
      setMessages((messages) => [...messages, lastJsonMessage.message]);
    } else if (type === "user.status") {
      const target_id = lastJsonMessage.user;
      const status = lastJsonMessage.status;

      setUsers((users) =>
        users.map((participant) => {
          if (participant.user.id === target_id) {
            return {
              ...participant,
              user: {
                ...participant.user,
                profile: {
                  ...participant.user.profile,
                  status: status,
                },
              },
            };
          }

          return participant;
        })
      );
    } else if (type === "group.notifications.message") {
      const targetGroupId = lastJsonMessage.group_id;
      const targetRoomId = lastJsonMessage.room_id;
      if (currentRoom && currentRoom.id === targetRoomId) {
        return;
      } else {
        setGroups((groups) =>
          groups.map((group) =>
            group.id === targetGroupId ? { ...group, is_read: false } : group
          )
        );
        setTopics((topics) => {
          if (topics)
            for (const topic of topics)
              for (const room of topic.rooms)
                if (room.id === targetRoomId) {
                  room.participant.unread_count += 1;
                  return topics;
                }

          return topics;
        });
      }
    }
  }, [lastJsonMessage]);

  return (
    <div className="flex flex-row w-full h-full">
      <ChannelRoomsBar />
      <div className="flex flex-col w-full h-full bg-gray-700">
        <NavigationTopBar />
        <div className="flex flex-row w-full h-full overflow-hidden">
          <ChatBox />
          <ChannelMembersBar />
        </div>
      </div>
    </div>
  );
};

export default ChannelBox;
