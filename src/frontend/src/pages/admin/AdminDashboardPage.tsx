import { useNavigate } from '@tanstack/react-router';
import { useGetAllArticles } from '../../hooks/useAdminContent';
import RequireAdmin from '../../components/auth/RequireAdmin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import PublishToggle from '../../components/admin/PublishToggle';

function AdminDashboardContent() {
  const navigate = useNavigate();
  const { data: articles, isLoading } = useGetAllArticles();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleEditArticle = (id: string) => {
    navigate({ to: '/admin/articles/$id/edit', params: { id } });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-light tracking-tight mb-4">Owner Dashboard</h1>
        <p className="text-lg text-muted-foreground">Manage and publish your articles</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-light">Articles</h2>
          </div>
          <Button size="sm" onClick={() => navigate({ to: '/admin/articles/new' })}>
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(article.updatedAt)}
                    </p>
                  </div>
                  <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                    {article.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditArticle(article.id)}>
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </Button>
                  <PublishToggle article={article} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No articles yet</p>
            <Button variant="outline" size="sm" onClick={() => navigate({ to: '/admin/articles/new' })}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first article
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RequireAdmin>
      <AdminDashboardContent />
    </RequireAdmin>
  );
}
