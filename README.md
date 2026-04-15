Next.js + Supabase 範例專案

簡介
-
這是一個以 Next.js（App Router）為基礎，並整合 Supabase 的範例專案，用來示範如何在前端存取 Supabase client、處理身分驗證與呼叫資料庫/API。

需求
-
- Node.js (建議 LTS)
- npm / yarn / pnpm

快速開始
-
1. 安裝相依套件：

```bash
npm install
```

2. 建立環境變數檔案 `.env.local`（放在專案根目錄），範例：

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. 啟動開發伺服器：

```bash
npm run dev
```

4. 在瀏覽器開啟：

```
http://localhost:3000
```

重要檔案
-
- [app/page.tsx](app/page.tsx#L1) - 網站首頁
- [app/handraise/page.tsx](app/handraise/page.tsx#L1) - 示範頁面（舉手功能）
- [app/select-class/page.tsx](app/select-class/page.tsx#L1) - 選課範例頁面
- [lib/supabase.ts](lib/supabase.ts#L1) - Supabase client 初始化（使用 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
- [types/database.ts](types/database.ts#L1) - 資料表型別定義（若有）

說明
-
- 本專案的 Supabase client 在 [lib/supabase.ts](lib/supabase.ts#L1) 中建立，會從環境變數讀取 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
- 若要修改頁面內容，請編輯 `app/` 下對應的 `page.tsx` 檔案，Next.js 將自動熱重載。

部署
-
部署到 Vercel 可直接使用預設設定，請在 Vercel 專案設定中加入相同的環境變數 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。更多部署資訊請參考 Next.js 官方文件。

其他資源
-
- Next.js 文件：https://nextjs.org/docs
- Supabase 文件：https://supabase.com/docs

