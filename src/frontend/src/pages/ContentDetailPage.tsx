import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useGetArticleById } from '../hooks/useContentPublic';
import ContentBodyRenderer from '../components/content/ContentBodyRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminSession } from '../hooks/useAdminSession';

export default function ContentDetailPage() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: article, isLoading } = useGetArticleById(id as string);
  const { isAuthenticated } = useAdminSession();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleEdit = () => {
    navigate({ to: '/admin/articles/$id/edit', params: { id: article!.id } });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-2xl font-light mb-4">Article not found</h1>
        <Link to="/articles">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link to="/articles">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
            {article.status}
          </Badge>
          {isAuthenticated && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <h1 className="text-5xl font-light tracking-tight mb-6">{article.title}</h1>

        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Published {formatDate(article.createdAt)}</span>
          </div>
          {article.updatedAt !== article.createdAt && (
            <span>Updated {formatDate(article.updatedAt)}</span>
          )}
        </div>

        {article.coverImage && (
          <div className="mb-12 rounded-xl overflow-hidden">
            <img
              src={article.coverImage.getDirectURL()}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      <ContentBodyRenderer body={article.body} />
    </article>
  );
}
