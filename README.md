# KRACKED_OS Standalone

This export runs without login and without Supabase.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Optional AI Key

Create `.env` from `.env.example` and set:

- `VITE_NVIDIA_API_KEY_70B`

If unset, terminal assistant falls back to local intelligence.

## Local Storage Keys

- `ijamos_profile`
- `ijamos_showcase_url`
- `ijamos_website_url`
- `ijamos_game_state`
- `vibe_os_booted`
- `vibe_wallpaper`
