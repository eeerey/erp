export interface ActivityLog {
  log_id: number;
  user_id: number;
  nama_user: string;
  email_user: string;
  nama_perusahaan: string | null;
  login_at: string;
  logout_at: string | null;
  duration_seconds: number | null;
}

export interface ActivityLogApiResponse {
  status: string;
  message: string;
  datetime: string;
  data: ActivityLog[];
}