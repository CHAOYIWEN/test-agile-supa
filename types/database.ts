/**
 * Supabase 資料庫類型定義
 * 根據 2026-04-12 DDL 版本產生
 */

// 使用者基本資料 (Profiles)
export interface Profile {
  id: string; // UUID (PRIMARY KEY)
  user_id?: string; // 使用者id (student_id or teacher_id)
  real_name?: string; // 真實姓名
  email?: string; // 信箱
  role?: 'teacher' | 'student'; // 角色限制為 teacher 或 student
  is_active?: 'Y' | 'N'; // 啟用狀態 Y/N
  created_at: string; // TIMESTAMP WITH TIME ZONE
  created_user?: string;
  updated_at: string;
  updated_user?: string;
}

// 課程 (Classes)
export interface Class {
  id: string; // UUID (PRIMARY KEY)
  class_code?: string; // 課程代碼 (UNIQUE)
  class_name: string; // 課程名稱 (NOT NULL)
  teacher_id?: string; // 外鍵關聯到 profiles.id
  created_at: string;
  created_user?: string;
  updated_at: string;
  updated_user?: string;
}

// 選課與分組 (Class Enrollments)
export interface ClassEnrollment {
  id: string; // UUID (PRIMARY KEY)
  class_id?: string; // 外鍵關聯到 classes.id
  student_id?: string; // 外鍵關聯到 profiles.id
  group_name?: string; // 組別
  group_role?: string; // 組別角色
  is_active: boolean; // 預設為 true
  created_at: string;
  created_user?: string;
  updated_at: string;
  updated_user?: string;
}

// 即時舉手 (Hand Raises)
export interface HandRaise {
  id: string; // UUID (PRIMARY KEY)
  class_id?: string; // 外鍵關聯到 classes.id
  student_id?: string; // 外鍵關聯到 profiles.id
  status: 'waiting' | 'called' | 'cancelled'; // 舉手狀態限制
  created_at: string;
  created_user?: string;
  updated_at: string;
  updated_user?: string;
}