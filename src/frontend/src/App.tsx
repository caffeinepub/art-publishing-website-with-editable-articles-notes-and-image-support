import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import SiteLayout from './components/layout/SiteLayout';
import ArticlesListPage from './pages/ArticlesListPage';
import ContentDetailPage from './pages/ContentDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ContentEditorPage from './pages/admin/ContentEditorPage';
import HomePage from './pages/HomePage';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
      <Toaster />
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const articlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/articles',
  component: ArticlesListPage,
});

const articleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/articles/$id',
  component: ContentDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const adminNewArticleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/articles/new',
  component: () => <ContentEditorPage mode="create" />,
});

const adminEditArticleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/articles/$id/edit',
  component: () => <ContentEditorPage mode="edit" />,
});

// Redirect old notes routes to articles
const notesRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes',
  beforeLoad: () => {
    throw redirect({ to: '/articles' });
  },
});

const noteDetailRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes/$id',
  beforeLoad: () => {
    throw redirect({ to: '/articles' });
  },
});

const adminNotesRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/notes/new',
  beforeLoad: () => {
    throw redirect({ to: '/admin' });
  },
});

const adminEditNoteRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/notes/$id/edit',
  beforeLoad: () => {
    throw redirect({ to: '/admin' });
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  articlesRoute,
  articleDetailRoute,
  adminRoute,
  adminNewArticleRoute,
  adminEditArticleRoute,
  notesRedirectRoute,
  noteDetailRedirectRoute,
  adminNotesRedirectRoute,
  adminEditNoteRedirectRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
