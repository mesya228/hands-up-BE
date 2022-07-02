import { ISchool, IUser } from '../models';

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
  roles,
  name,
  surname,
  thirdname,
  username,
});

export const getScroolPublicProps = ({ id, name }: ISchool): ISchool => ({
  id,
  name,
});
