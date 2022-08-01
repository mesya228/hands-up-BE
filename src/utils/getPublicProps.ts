import { IClass, IClassMarks, IUser } from '../models';

export const getUserPublicProps = ({
  uuid,
  email,
  roles,
  name,
  school,
  surname,
  thirdname,
  username,
  state,
}: IUser): IUser => ({
  uuid,
  email,
  roles,
  name,
  school,
  surname,
  thirdname,
  username,
  state,
});

export const getSimplePublicProps = ({ id, name }: any) => ({
  id,
  name,
});

export const getClassPublicProps = ({ id, name, school, students }: IClass): IClass => ({
  id,
  name,
  school,
  students,
});

export const getClassMarksProps = ({ id, classId, subjectId, marks, teachers }: IClassMarks): IClassMarks => ({
  id,
  classId,
  subjectId,
  marks,
  teachers,
});
