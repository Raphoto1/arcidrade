export interface UserDataCatch {
  name: string;
  last_name: string;
  birthDate: DateTime;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  title: string;
  titleInstitution: string;
  studyCountry: string;
  titleStatus: "onGoing" | "completed" | "paused";
  local_id?: string;
  cv_file?: string;
  cv_link?: string;
  avatar?: string;
}
