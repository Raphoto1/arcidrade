import bcrypt from "bcrypt";

export const encrypt = async (data: string) => {
    // Implement encryption logic here
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data, salt);
  return hash
};

export const compare = async (data: string, dbData: string, hash: string) => {
  const textFromDb = bcrypt.compareSync(data, hash); // true
  const textFromForm = bcrypt.compareSync(dbData, hash); // false
 return {
    textFromDb,
    textFromForm
  };
};
