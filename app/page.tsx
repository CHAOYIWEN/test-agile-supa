"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // 儲存友善的錯誤訊息
  const [loading, setLoading] = useState(false); // 登入狀態控制
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null); // 每次嘗試登入前先重置錯誤
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      // 在 Console 留下詳細技術 Log 供開發者排查
      console.error("Supabase Login Error:", error.message);

      // 根據錯誤訊息進行「中文化」轉譯
      if (error.message === 'Invalid login credentials') {
        setErrorMsg("帳號或密碼輸入錯誤，請重新確認");
      } else if (error.message.includes('too many requests')) {
        setErrorMsg("登入嘗試次時過多，請稍後再試");
      } else {
        setErrorMsg("登入失敗，請檢查網路連線或聯繫老師");
      }
      setLoading(false);
    } else {
      router.push('/select-class'); // 成功後直接跳轉
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          {/* 加入一個簡單的小圖示增加互動感 */}
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            🎓
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">課堂互動系統</h1>
          <p className="text-slate-400 mt-2 font-medium">Agile Development Class</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">電子信箱</label>
            <input 
              type="email" 
              className={`w-full px-5 py-4 rounded-2xl border ${errorMsg ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-slate-50'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 font-medium`}
              placeholder="請輸入註冊信箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">登入密碼 (預設為學號)</label>
            <input 
              type="password" 
              className={`w-full px-5 py-4 rounded-2xl border ${errorMsg ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-slate-50'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 font-medium`}
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 錯誤訊息顯示區塊 */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-500 text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span>⚠️</span> {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
              loading 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                驗證中...
              </>
            ) : (
              '進入系統'
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-slate-300 font-medium">
          © 2026 Agile Class Management System
        </p>
      </div>
    </div>
  );
}