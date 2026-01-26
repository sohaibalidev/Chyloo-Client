// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig(({ command, mode }) => {
//   const isProduction = mode === 'production';

//   const plugins = [react()];

//   if (isProduction) {
//     import('vite-plugin-prerender').then(module => {
//       const { VitePluginPrerender } = module;
//       plugins.push(
//         VitePluginPrerender({
//           staticDir: path.join(__dirname, 'dist'),
//           routes: [
//             '/auth/login',
//             '/auth/register',
//             '/auth/forgot-password',
//             '/auth/reset-password',
//             '/search',
//             '/messages',
//             '/notifications',
//             '/settings',
//             '/posts/new',
//             '/stories/new',
//           ],
//         })
//       );
//     });
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
//     define: {
//       'import.meta.env.MODE': JSON.stringify(mode),
//       'import.meta.env.PROD': JSON.stringify(isProduction),
//       'import.meta.env.DEV': JSON.stringify(!isProduction),
//     },
//   };
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePluginPrerender } from 'vite-plugin-prerender';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';

  const plugins = [react()];

  if (isProduction) {
    plugins.push(
      VitePluginPrerender({
        staticDir: path.join(__dirname, 'dist'),
        routes: [
          '/auth/login',
          '/auth/register',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/search',
          '/messages',
          '/notifications',
          '/settings',
          '/posts/new',
          '/stories/new',
        ],
      })
    );
  }

  return {
    plugins,
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
    define: {
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env.PROD': JSON.stringify(isProduction),
      'import.meta.env.DEV': JSON.stringify(!isProduction),
    },
  };
});
