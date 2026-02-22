import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  testMatch: /.*\.spec\.ts$/,
  use: {
    baseURL: 'http://127.0.0.1:4173'
  },
  webServer: [
    {
      command:
        'cd ../backend && UV_CACHE_DIR=../.uv-cache uv run uvicorn src.main:app --host 127.0.0.1 --port 8000',
      url: 'http://127.0.0.1:8000/api/v1/health',
      reuseExistingServer: true,
      timeout: 120_000
    },
    {
      command: 'VITE_API_BASE_URL=http://127.0.0.1:8000 npm run dev -- --host 127.0.0.1 --port 4173',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: true,
      timeout: 120_000
    }
  ]
})
