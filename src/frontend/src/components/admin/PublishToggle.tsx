import { Button } from '@/components/ui/button';
import { usePublishArticle, useUnpublishArticle } from '../../hooks/useAdminContent';
import { Article } from '../../backend';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PublishToggleProps {
  article: Article;
}

export default function PublishToggle({ article }: PublishToggleProps) {
  const publishMutation = usePublishArticle();
  const unpublishMutation = useUnpublishArticle();

  const isPublished = article.status === 'published';
  const isLoading = publishMutation.isPending || unpublishMutation.isPending;

  const handleToggle = async () => {
    try {
      if (isPublished) {
        await unpublishMutation.mutateAsync(article.id);
        toast.success('Article unpublished');
      } else {
        await publishMutation.mutateAsync(article.id);
        toast.success('Article published');
      }
    } catch (error: any) {
      const errorMessage = error?.message || '';
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('admin')) {
        toast.error('Owner access required to publish articles');
      } else {
        toast.error(`Failed to ${isPublished ? 'unpublish' : 'publish'} article`);
      }
      console.error(error);
    }
  };

  return (
    <Button
      variant={isPublished ? 'outline' : 'default'}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
      ) : isPublished ? (
        <EyeOff className="w-3 h-3 mr-2" />
      ) : (
        <Eye className="w-3 h-3 mr-2" />
      )}
      {isPublished ? 'Unpublish' : 'Publish'}
    </Button>
  );
}
