export interface IUserData {
  id: string;
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImg: string;
}

export interface IToken {
  access: string;
  refresh: string;
}
