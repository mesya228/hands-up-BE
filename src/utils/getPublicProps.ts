import { IClass, IClassMarks, IUser } from '../models';

export const getUserPublicProps = ({
  uuid,
  email,
  roles,
  name,
  school,
  surname,
  thirdname,
  login,
  state,
}: IUser): IUser => ({
  uuid,
  email,
  roles,
  name,
  school,
  surname,
  thirdname,
  login,
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

export const getStatisticsPublicProps = ({ achievments, subjects }: any) => ({
  achievments,
  subjects,
});

export const getSubjectStatisticsPublicProps = ({ id, name, expirience, level }: any) => ({
  id,
  name, 
  expirience,
  level,
});

export const getAchievmentsPublicProps = ({ id, name, imageUrl }: any) => ({
  id,
  name,
  imageUrl,
});
