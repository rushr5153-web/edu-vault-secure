# Edu Share Hub

Education වලට website එකක් හදන්න නවින විදියට එකට pdf upload කරන්න පුලුවන් කරන්න .pdf upload කරද්දි admin123 password enter කල යුතුයි නමුත් එ password එක පෙන්නන එපා. Pdf upload description දන්න පුලුවන් කරන්න .pdf download butoon දන්න. Download butoon unblock කරන්න verify butoon එකක් දන්න එ verify butoon එකට මන් දෙන adsterra link එක දන්න verify butoon එබුවම් adsterra link එක open වෙන්න හදන්න  .තප්පර 30 count වුනාම ඔබලා download කරගන්න පුලුවන් කරන්න . Adsterra direct link

https://www.profitableratecpmnetwork.com/id0znyyqq?key=ba1509e59bb6ca1813723f7d0b9dda32

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://edu-vault-secure.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dd099658-3a32-4914-afb2-785f95d8ce86).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

---

## GitHub + Netlify Deploy Guide

### 1. GitHub එකට upload කරන්න
Lovable editor එකේ **+ menu → GitHub → Connect project** ඔබලා repository එකක් හදන්න. ඊට පස්සේ changes ඔක්කොම auto-sync වෙනවා.

### 2. Netlify එකට connect කරන්න
1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project → GitHub** තෝරන්න.
2. Repository එක select කරන්න. Build settings `netlify.toml` එකෙන් auto-fill වෙනවා.
3. **Site settings → Environment variables** වලට මේවා add කරන්න:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (upload/download server functions වලට අවශ්‍යයි)
   - `UPLOAD_PASSWORD` (admin upload password එක)
4. **Deploy** ඔබන්න.

> ⚠️ සටහන: PDF upload/download features වැඩ කරන්න `SUPABASE_SERVICE_ROLE_KEY` අවශ්‍යයි. ඒක නැතිව deploy කළොත් site එක open වෙනවා, ඒත් upload/download කැඩෙනවා. සම්පූර්ණ features ඔක්කොම එකට වැඩ කරන විදියට host කරන්න නම් Lovable **Publish** button එක use කරන්න.
