export type UserProfile = {
  id: string;
  name: string;
  email: string;
  coupleId?: string | null;
};

export type Couple = {
  id: string;
  name: string;
  members: string[];
};

export type Transaction = {
  id: string;
  coupleId: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  createdBy: string;
  ownerId?: string;
  date: string;
  createdAt?: Date;
};

export type Goal = {
  id: string;
  coupleId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
};

export type ActivityItem = {
  id: string;
  type: "transaction" | "goal" | "couple";
  title: string;
  detail: string;
  date: string;
  createdBy?: string;
  accent?: "income" | "expense" | "accent";
};
