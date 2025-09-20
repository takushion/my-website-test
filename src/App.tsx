import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';

// --- ページの遅延読み込み（Lazy Loading） ---
// 最初は全ページを読み込まず、アクセスされた時に初めて読み込むようにします。
// これでサイトの初期表示が高速化されます。
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const MyFriendsPage = lazy(() => import('./pages/MyFriendsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <BrowserRouter>
      {/* Suspenseは、遅延読み込みしたコンポーネントの準備ができるまで
        待機中に表示する内容（ローディング表示など）を指定します。
      */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* MainLayoutを適用したいページ群をグループ化 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/myfriends" element={<MyFriendsPage />} />
          </Route>

          {/* 上記のどのルートにも一致しなかった場合に表示されます。
            path="*" は「全ての未定義のパス」を意味します。
          */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;