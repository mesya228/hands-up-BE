import { IClass, IClassMarks, ISchool, IUser } from '../models';

export const getUserPublicProps = ({
  uuid,
  email,
  roles,
  name,
  school,
  surname,
  thirdname,
  username,
}: IUser): IUser => ({
  uuid,
  email,
  roles,
  name,
  school,
  surname,
  thirdname,
  username,
});

export const getSchoolPublicProps = ({ id, name }: ISchool): ISchool => ({
  id,
  name,
});

export const getClassPublicProps = ({
  id,
  name,
  school,
  students,
}: IClass): IClass => ({
  id,
  name,
  school,
  students,
});

export const getClassMarksProps = ({
  id,
  classId,
  marks,
  teachers,
}: IClassMarks): IClassMarks => ({
  id,
  classId,
  marks,
  teachers,
});
