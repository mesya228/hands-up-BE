import { IUser } from "../models";

export const getUserPublicProps = ({
  uuid,
  email,
  name,
  roles,
  surname,
  thirdname,
  username,
}: IUser): IUser => ({
  uuid,
  email,
  name,
  roles,
  surname,
  thirdname,
  username,
});
