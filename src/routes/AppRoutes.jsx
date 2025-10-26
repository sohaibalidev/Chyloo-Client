// import { Routes, Route, Navigate } from 'react-router-dom';
// import PrivateRoute from '@/routes/PrivateRoute';
// import GuestRoute from '@/routes/GuestRoute';

// import BaseLayout from '@/layouts/BaseLayout';

// import authRoutes from '@/routes/AuthRoutes';
// import baseRoutes from '@/routes/BaseRoutes';

// export default function AppRoutes() {
//   return (
//     <Routes>
//       {/* Auth routes */}
//       {authRoutes.map(({ path, element }) => (
//         <Route key={path} path={`/auth/${path}`} element={<GuestRoute>{element}</GuestRoute>} />
//       ))}

//       {/* Base routes */}
//       {baseRoutes.map(({ path, element, isPrivate }) => (
//         <Route
//           key={path}
//           path={`/${path}`}
//           element={
//             isPrivate ? (
//               <PrivateRoute>
//                 <BaseLayout>{element}</BaseLayout>
//               </PrivateRoute>
//             ) : (
//               <BaseLayout>{element}</BaseLayout>
//             )
//           }
//         />
//       ))}

//       {/* Redirects */}
//       <Route path='/' element={<Navigate to='/' />} />
//       <Route path='*' element={<Navigate to='/' />} />
//     </Routes>
//   );
// }


import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRouteWithSEO from '@/routes/PrivateRouteWithSEO'; // Updated
import GuestRoute from '@/routes/GuestRoute';

import BaseLayout from '@/layouts/BaseLayout';

import authRoutes from '@/routes/AuthRoutes';
import baseRoutes from '@/routes/BaseRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      {authRoutes.map(({ path, element }) => (
        <Route key={path} path={`/auth/${path}`} element={<GuestRoute>{element}</GuestRoute>} />
      ))}

      {/* Base routes */}
      {baseRoutes.map(({ path, element, isPrivate }) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            isPrivate ? (
              <PrivateRouteWithSEO> {/* Updated */}
                <BaseLayout>{element}</BaseLayout>
              </PrivateRouteWithSEO>
            ) : (
              <BaseLayout>{element}</BaseLayout>
            )
          }
        />
      ))}

      {/* Redirects */}
      <Route path='/' element={<Navigate to='/' />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
}