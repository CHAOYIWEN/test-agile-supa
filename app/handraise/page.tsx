"use client";
import { useState, useEffect, Suspense } from 'react'; // 加上 Suspense
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

// --- 1. 抽離出來的子組件，負責處理舉手邏輯 ---
function HandRaiseContent() {
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  
  const [userName, setUserName] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [isRaising, setIsRaising] = useState(false);
  const [raiseId, setRaiseId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!classId) {
      router.push('/select-class');
      return;
    }

    const fetchInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);

      // 1. 抓取姓名
      const { data: profile } = await supabase
        .from('profiles')
        .select('real_name')
        .eq('id', user.id)
        .single();
      setUserName(profile?.real_name || user.email);

      // 2. 抓取小組名稱
      const { data: enrollment } = await supabase
        .from('class_enrollments')
        .select('group_name')
        .eq('student_id', user.id)
        .eq('class_id', classId)
        .maybeSingle();
      
      if (enrollment) {
        setGroupName(enrollment.group_name);
      }

      // 3. 抓取課程名稱
      const { data: classData } = await supabase
        .from('classes')
        .select('class_name')
        .eq('id', classId)
        .single();
      if (classData) setClassName(classData.class_name);
      
      // 4. 檢查舉手狀態
      const { data: raiseData } = await supabase
        .from('hand_raises')
        .select('id')
        .eq('student_id', user.id)
        .eq('class_id', classId)
        .eq('status', 'waiting')
        .maybeSingle();

      if (raiseData) {
        setIsRaising(true);
        setRaiseId(raiseData.id);
      }
    };
    fetchInitialData();
  }, [router, classId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleBackToSelect = async () => {
    if (isRaising && raiseId) {
      await supabase
        .from('hand_raises')
        .update({ status: 'cancelled' })
        .eq('id', raiseId);
    }
    router.push('/select-class');
  };

  const toggleHandRaise = async () => {
    if (!isRaising) {
      const { data, error } = await supabase
        .from('hand_raises')
        .insert([{ 
          student_id: user.id, 
          status: 'waiting', 
          class_id: classId 
        }])
        .select();
      
      if (!error && data) {
        setIsRaising(true);
        setRaiseId(data[0].id);
      }
    } else {
      const { error } = await supabase
        .from('hand_raises')
        .update({ status: 'cancelled' })
        .eq('id', raiseId);
      
      if (!error) {
        setIsRaising(false);
        setRaiseId(null);
      }
    }
  };

  if (!user || !userName) return <div className="p-8 text-center text-slate-900 font-bold">載入中...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Header */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex flex-col">
          <span className="font-bold text-indigo-600 text-lg">Agile Class</span>
          <div className="flex gap-2 mt-0.5">
            <span className="text-[16px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              📍 {className || '讀取中...'}
            </span>
            {groupName && (
              <span className="text-[16px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                👥 {groupName}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 pb-24">
        <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl mb-6 transition-all duration-500 ${isRaising ? 'bg-yellow-400 animate-pulse shadow-lg' : 'bg-slate-100'}`}>
            {isRaising ? '✋' : '💤'}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {isRaising ? '正在舉手中' : '準備發言？'}
          </h2>
          <p className="text-slate-500 mb-1 text-[16px] leading-relaxed">
            {isRaising 
              ? `老師已在 ${className} 的名單中看到您囉！` 
              : `點擊按鈕加入 ${className} 的舉手隊伍`}
          </p>
          
          {groupName && (
            <p className="text-[12px] text-indigo-400 mb-10 font-bold">
              小組夥伴：{groupName}
            </p>
          )}

          <button
            onClick={toggleHandRaise}
            className={`w-full py-5 rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-lg ${
              isRaising 
              ? 'bg-rose-50 text-rose-600 border-2 border-rose-200 hover:bg-rose-100' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isRaising ? '取消舉手' : '點我舉手'}
          </button>
        </div>
      </main>

      {/* 返回按鈕 */}
      <div className="fixed bottom-8 left-8">
        <button 
          onClick={handleBackToSelect}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all py-2 px-4 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100"
        >
          <span className="text-xl">←</span>
          <span className="text-[20px] font-bold tracking-tight">更換參與課程</span>
        </button>
      </div>
    </div>
  );
}

// --- 2. 主頁面組件：使用 Suspense 包裹子組件 ---
export default function HandRaisePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-900 font-bold">系統載入中...</div>}>
      <HandRaiseContent />
    </Suspense>
  );
}