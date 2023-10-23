export const accessTokenName = import.meta.env.VITE_ACCESS_TOKEN_NAME;
export const refreshTokenName = import.meta.env.VITE_REFRESH_TOKEN_NAME;

export const host = import.meta.env.VITE_HOST;
export const port = import.meta.env.VITE_PORT;
const base = `http://${host}:${port}`;

export const GOOGLE_OAUTH_URL = `${base}/auth/accounts/google/login/`;
export const GITHUB_OAUTH_URL = `${base}/auth/accounts/github/login/`;
export const CHAT_WEBSOCKET_URL = `ws://${host}:${port}/ws/chat`;

export const API_URLS = {
  local: {
    HOMEPAGE: () => "/",
    LOGIN: () => "/login",
    LOGOUT: () => "/logout",
    SIGNUP: () => "/signup",
    RESET_PASSWORD: () => "/password/reset",
    CHAT_DASHBOARD: () => "/chat",
    GROUP: (group_id: string | number) => `/chat/${group_id}`,
  },

  api: {
    LOGIN: () => `${base}/auth/login/`,
    SOCIAL_LOGIN_GOOGLE: () => `${base}/auth/accounts/google/login/`,
    SOCIAL_LOGIN_GITHUB: () => `${base}/auth/accounts/github/login/`,
    LOGOUT: () => `${base}/auth/logout/`,
    SIGNUP: () => `${base}/auth/signup/`,
    // TOKEN_VERIFY originally was /auth/token/verify/, but was replaced
    // with simpler view that extracts and verifies user cookies via
    // GET request without passing access token in request body explicitly
    TOKEN_VERIFY: () => `${base}/auth/is-authenticated/`,
    TOKEN_REFRESH: () => `${base}/auth/token/refresh/`,

    GET_USER_PROFILE: () => `${base}/api/profile/`,
    UPDATE_USER_PROFILE: () => `${base}/api/profile/`,
    GET_GROUP_LIST: () => `${base}/api/groups/`,
    GET_GROUP_DATA: (group_id: string | number) =>
      `${base}/api/groups/${group_id}/`,
    GET_ROOM_DATA: (room_id: string | number) =>
      `${base}/api/rooms/${room_id}/`,
    GET_PUBLIC_GROUPS: (category: string) =>
      `${base}/api/public-groups/${category}/`,
    GET_ALL_PUBLIC_GROUPS: () => `${base}/api/public-groups/`,
    CREATE_GROUP: () => `${base}/api/groups/create/`,
    JOIN_GROUP: (group_id: string | number) =>
      `${base}/api/groups/${group_id}/join/`,
    LEAVE_GROUP: (group_id: string | number) =>
      `${base}/api/groups/${group_id}/leave/`,
    UPDATE_GROUP: (group_id: string | number) =>
      `${base}/api/groups/${group_id}/update/`,
    DELETE_GROUP: (group_id: string | number) =>
      `${base}/api/groups/${group_id}/delete/`,
    CREATE_TOPIC: () => `${base}/api/topics/create/`,
    UPDATE_TOPIC: (topic_id: number) =>
      `${base}/api/topics/${topic_id}/update/`,
    DELETE_TOPIC: (topic_id: number) =>
      `${base}/api/topics/${topic_id}/delete/`,
    CREATE_ROOM: () => `${base}/api/rooms/create/`,
    UPDATE_ROOM: (room_id: number) => `${base}/api/rooms/${room_id}/update/`,
    DELETE_ROOM: (room_id: number) => `${base}/api/rooms/${room_id}/delete/`,

    QUERY_PUBLIC_GROUPS: (query: string) => `${base}/search/groups/${query}/`,
    QUERY_USER_RELATED_MESSAGES: (query: string) =>
      `${base}/search/messages/${query}/`,
  },
};

export type LoginAPI = { password: string } & (
  | { email: string }
  | { username: string }
  | { email: string; username: string }
);

export type SignupAPI = {
  username: string;
  full_name: string;
  email?: string;
  password1: string;
  password2: string;
};

export type UpdateProfileAPI = {
  username?: string;
  icon?: Blob;
  wallpaper?: Blob;
  full_name?: string;
  bio?: string;
  status?: string;
};

export type GetGroupAPI = {
  id: number;
  name: string;
  icon: string;
  wall_image: string;
  category: string;
  description: string;
  is_public: boolean;
};

export type UpdateGroupAPI = {
  name?: string;
  icon?: Blob;
  wall_image?: Blob;
  category?: string;
  description?: string;
  is_public?: string;
};

export const UserStatus = {
  ONLINE: "Online",
  OFFLINE: "Offline",
  SLEEPING: "Sleeping",
  BUSY: "Busy",
};

export type MessageType = {
  id: number;
  room: number;
  text: string;
  reply_to: number | null;
  date_sent: string;
  sender: UserType;
};

export type RoomParticipantType = {
  unread_count: number;
  last_read_message: MessageType;
};

export type RoomType = {
  id: number;
  name: string;
  topic: number;
  description: string;
  participant: RoomParticipantType;
};

export type TopicType = {
  id: number;
  name: string;
  group: number;
  rooms: Array<RoomType>;
};

export type GroupType = {
  id: number;
  name: string;
  icon: string;
  is_read: boolean;
};

export type PublicGroupType = {
  id: number;
  name: string;
  icon: string;
  description: string;
  wall_image: string;
  participant_count: string;
  online_count: string;
};

export type RoleType = {
  id: number;
  name: string;
};

export type ProfileType = {
  icon: string;
  wallpaper: string;
  full_name: string;
  bio: string;
  status: string;
  date_joined: string;
};

export type UserType = {
  id: number;
  username: string;
  profile: ProfileType;
};

export type ParticipantType = {
  id: number;
  role: RoleType;
  user: UserType;
};
