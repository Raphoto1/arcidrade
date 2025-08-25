import bcrypt from "bcrypt";

export const encrypt = async (data: string) => {
  // Implement encryption logic here
  console.log('Encrypting data...', data);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data, salt);
  console.log('Encrypted data:', hash);
  
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
