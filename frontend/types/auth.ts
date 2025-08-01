import { Plan } from ".";

export interface AuthResponse {
    message: string;
    user: User
    token?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
  email_verified: string;
  profile_photo?: string;
  active_subscription?: Subscription
  current_plan?: Plan;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  trial_ends_at?: string;
  cancelled_at?: string;
  payment_status: string;
  plan: Plan;
  user: User;
}

export interface PlanFeature {
  id: string;
  plan_id: string;
  feature_key: string;
  feature_value: string;
  description?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}