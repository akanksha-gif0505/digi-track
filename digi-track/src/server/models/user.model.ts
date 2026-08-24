export interface UserModel {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  currencySymbol: string;
  currencyCode: string;
  isPremium: boolean;
  onboarded: boolean;
  phone?: string;
  jobTitle?: string;
  createdAt: number;
  updatedAt: number;
}

export type SafeUser = Omit<UserModel, 'passwordHash'>;
