export type TUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "investor" | string;
  phone: string | null;
  profileImage: string | null;
  countryOfResidence: string | null;
  investmentBudget: string | null;
  investmentGoal: string | null;
  investmentTimeline: string | null;
  lastPasswordChangeTime: string | null;
  registrationTime: string;
  isVerified: boolean;
  status: "active" | "inactive" | string;
  provider: string;
  image: string | null;
};
