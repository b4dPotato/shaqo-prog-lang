import { defineConfig } from 'vite'

export default defineConfig({
  root: `${process.cwd()}/src`,
  server: {
    port: 8080,
  }
})