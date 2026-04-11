# 棲地無界 Borderless Habitat

棲地無界（WHV）是以台灣視角打造的打工度假知識庫、Realtime 討論區與過來人媒合平台，技術棧使用 Next.js App Router、Supabase、Tailwind CSS 與 shadcn/ui 風格元件。

## 技術重點

- Next.js App Router（以 Server Components 與 Server Actions 為主）
- Supabase PostgreSQL + Auth + Realtime + Storage
- Tiptap 富文本編輯器
- Tailwind CSS + shadcn/ui 風格元件
- 未填 Supabase 環境變數時可用示範資料正常啟動與 build
- 支援 `mock / auto / live` 的 mock-to-live 切換策略

## 本機開發

1. 複製環境變數模板：

```bash
cp .env.example .env.local
```

2. 安裝依賴：

```bash
npm install
```

3. 啟動開發伺服器：

```bash
npm run dev
```

4. 開啟 `http://localhost:3000`

## Supabase 設定

### 1. 建立 Supabase Free 專案

1. 前往 Supabase 建立新專案
2. 選擇 Free Plan
3. 記下：
   - `Project URL`
   - `anon public key`
   - 後續若要做後台管理再額外保存 `service role key`

### 2. 執行資料庫 migration

在 Supabase Dashboard：

1. 進入 `SQL Editor`
2. 建立新的 query
3. 依照下列順序執行 migration：
   - [`supabase/migrations/20260401_001_core_schema.sql`](/c:/Users/a9986/Downloads/VS%20code/WHV/supabase/migrations/20260401_001_core_schema.sql)
   - [`supabase/migrations/20260401_002_automation_indexes_and_rls.sql`](/c:/Users/a9986/Downloads/VS%20code/WHV/supabase/migrations/20260401_002_automation_indexes_and_rls.sql)
   - [`supabase/migrations/20260401_003_seed_storage_and_realtime.sql`](/c:/Users/a9986/Downloads/VS%20code/WHV/supabase/migrations/20260401_003_seed_storage_and_realtime.sql)
4. 若想先了解整體順序，可先看 [`supabase/MIGRATION_FLOW.md`](/c:/Users/a9986/Downloads/VS%20code/WHV/supabase/MIGRATION_FLOW.md)
5. 若你是直接在 Supabase Dashboard 手動執行，請照 [`supabase/SQL_EDITOR_CHECKLIST.md`](/c:/Users/a9986/Downloads/VS%20code/WHV/supabase/SQL_EDITOR_CHECKLIST.md) 的順序跑

這組 migration 會建立：

- `countries`
- `posts`
- `discussions`
- `profiles`
- `avatars` / `post-images` storage buckets
- RLS policies
- `discussions` 的 Supabase Realtime publication
- 17 個打工度假國家 seed data

### 3. 啟用 Auth Provider

在 Supabase Dashboard → `Authentication` → `Providers`：

1. 啟用 `Email`
2. 若要支援 Google 登入，再啟用 `Google`
3. Google OAuth callback URL 請填：

```text
https://<your-project-ref>.supabase.co/auth/v1/callback
```

### 4. 設定本機環境變數

在 `.env.local` 填入：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTENT_MODE=auto
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon public key
```

如果你想先專心做前端 prototype，可改成：

```env
NEXT_PUBLIC_CONTENT_MODE=mock
```

完整說明可看 [`supabase/MOCK_TO_LIVE.md`](/c:/Users/a9986/Downloads/VS%20code/WHV/supabase/MOCK_TO_LIVE.md)

## 免費部署：Vercel Hobby + Supabase Free

### A. 將專案推到 GitHub

1. 建立 GitHub repository
2. 將 `WHV` 專案 push 上去

### B. 在 Vercel 建立專案

1. 前往 Vercel
2. 點 `Add New...` → `Project`
3. 匯入 GitHub 上的 `WHV`
4. Framework Preset 保持 `Next.js`
5. Plan 選 `Hobby`

### C. 在 Vercel 設定環境變數

Vercel Project → `Settings` → `Environment Variables`

加入到 `Production`、`Preview`、`Development`：

```env
NEXT_PUBLIC_SITE_URL=https://你的-vercel-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon public key
```

如果之後綁定自訂網域，請同步更新 `NEXT_PUBLIC_SITE_URL`。

### D. 設定 Supabase Auth Redirect URLs

在 Supabase Dashboard → `Authentication` → `URL Configuration`：

1. `Site URL` 設為正式站點，例如：

```text
https://你的-vercel-domain.vercel.app
```

2. `Redirect URLs` 加入：

```text
http://localhost:3000/auth/callback
https://你的-vercel-domain.vercel.app/auth/callback
https://你的-preview-domain.vercel.app/auth/callback
```

若有自訂網域，也請把自訂網域的 `/auth/callback` 一併加入。

### E. 重新部署並驗證

1. 在 Vercel 點 `Deploy`
2. 部署成功後開啟站點
3. 測試：
   - 首頁是否正常載入
   - 國家頁是否讀到 seed data
   - Email 註冊 / 登入
   - Google 登入（若有設定）
   - 投稿頁是否能建立文章
   - 文章頁留言是否能透過 Supabase Realtime 即時更新

## Supabase Realtime 設定提醒

若 migration 已執行但留言沒有即時更新，請確認：

1. `discussions` 已加入 `supabase_realtime` publication
2. 專案沒有關閉 Realtime
3. RLS policy 已允許 `select` 與 `insert`
4. 前端環境變數是正確的 Project URL 與 anon key

## 專案結構

```text
app/
  (auth)/
  (main)/
  auth/callback/route.ts
components/
  country/
  discussion/
  layout/
  post/
  ui/
lib/
  data.ts
  mock-data.ts
  supabase.ts
  utils.ts
  validations.ts
supabase/
  migrations/
types/
```

## 補充說明

- `create-next-app` 目前不接受大寫 npm package 名稱，所以建立時使用小寫 package name，之後維持資料夾名稱為 `WHV`。
- 若沒有填入 Supabase 環境變數，專案仍會以 mock data 啟動，方便先檢查 UI 與路由。
- 正式上線時請務必完成 Supabase Auth、RLS 與 Redirect URLs 設定，否則登入與投稿功能不會完整生效。
