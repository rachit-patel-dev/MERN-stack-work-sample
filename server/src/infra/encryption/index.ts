import bcrypt from 'bcrypt';

const encryptPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (password: string, encodedPassword: string): boolean => {
  return bcrypt.compareSync(password, encodedPassword);
};

export { encryptPassword, comparePassword };
