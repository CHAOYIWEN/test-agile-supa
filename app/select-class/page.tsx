"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SelectClassPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      // 1. 抓取真實姓名
      const { data: profile } = await supabase
        .from('profiles')
        .select('real_name')
        .eq('id', user.id)
        .single();
      if (profile) setUserName(profile.real_name);

      // 2. 抓取該學生有選修的課程
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select(`
          class_id,
          classes (
            id,
            class_name,
            class_code
          )
        `)
        .eq('student_id', user.id);

      if (enrollments) {
        const classList = enrollments.map((item: any) => item.classes);
        setClasses(classList);
      }
      setLoading(false);
    };
    fetchData();
  }, [router]);

  // 登出功能
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSelect = (classId: string) => {
    router.push(`/handraise?classId=${classId}`);
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-600">載入課程中...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 右上角導航欄 - 保持與 Handraise 畫面一致 */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex flex-col">
          <span className="font-bold text-indigo-600 text-lg">Agile Class</span>
          <span className="text-[16px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded w-fit">
            SELECT COURSE
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <span className="text-sm font-bold text-slate-700">HI, {userName}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm text-rose-500 hover:text-rose-700 font-bold transition border border-rose-100 px-3 py-1.5 rounded-xl hover:bg-rose-50"
          >
            登出
          </button>
        </div>
      </nav>

      {/* 原本風格的課程選擇區域 */}
      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="max-w-2xl w-full mt-10">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{userName}，你好 👋</h1>
          <p className="text-slate-500 mb-8 font-medium">請選擇您今天要參與的課程：</p>

          <div className="grid gap-4">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => handleSelect(cls.id)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:border-indigo-500 hover:shadow-md transition group"
                >
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600">{cls.class_name}</h3>
                    <p className="text-sm text-slate-400">{cls.class_code}</p>
                  </div>
                  <span className="text-indigo-500 font-bold group-hover:translate-x-1 transition-transform">進入教室 →</span>
                </button>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">目前沒有加入任何課程</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}