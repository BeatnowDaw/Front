interface UserData {
  full_name: string;
  username: string;
  email: string;
  id: string;           // Esto mapea con _id del backend, deberías hacer ese ajuste.
  is_active: boolean;
  bio: string;
  followers: number;
  following: number;
  post_num: number;
  is_following: boolean;
}
