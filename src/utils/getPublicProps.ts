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

export const getStatisticsPublicProps = ({ achievements, subjects }: any) => ({
  achievements,
  subjects,
});

export const getSubjectStatisticsPublicProps = ({ id, name, experience, experienceGoal, level }: any) => ({
  id,
  name, 
  experience,
  experienceGoal,
  level,
});

export const getAchievementsPublicProps = ({ id, name, imageUrl }: any) => ({
  id,
  name,
  imageUrl,
});
