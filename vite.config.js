// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';
// import prerender from 'vite-plugin-prerender';

// export default defineConfig(({ mode }) => {
//   const isProduction = mode === 'production';

//   const plugins = [react()];

//   if (isProduction) {
//     plugins.push(
//       prerender({
//         staticDir: path.join(__dirname, 'dist'),
//         routes: [
//           '/auth/login',
//           '/auth/register',
//           '/auth/forgot-password',
//           '/auth/reset-password',
//           '/search',
//           '/messages',
//           '/notifications',
//           '/settings',
//           '/posts/new',
//           '/stories/new',
//         ],
//       })
//     );
//   }

//   return {
//     plugins,
//     resolve: {
//       alias: {
//         '@': path.resolve(__dirname, 'src'),
//       },
//     },
//     server: {
//       watch: {
//         usePolling: true,
//         interval: 100,
//       },
//     },
//   };
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  }
})
