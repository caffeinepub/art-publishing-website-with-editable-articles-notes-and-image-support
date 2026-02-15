import { useGetPublishedArticles } from '../hooks/useContentPublic';
import ContentCard from '../components/content/ContentCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticlesListPage() {
  const { data: articles, isLoading } = useGetPublishedArticles();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-light tracking-tight mb-4">Articles</h1>
        <p className="text-lg text-muted-foreground">
          In-depth explorations and long-form writing
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-xl p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="space-y-6">
          {articles.map((article) => (
            <ContentCard key={article.id} content={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No articles published yet.</p>
        </div>
      )}
    </div>
  );
}
