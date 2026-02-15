import { Link } from '@tanstack/react-router';
import { Article } from '../../backend';
import { Calendar } from 'lucide-react';

interface ContentCardProps {
  content: Article;
}

export default function ContentCard({ content }: ContentCardProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const linkPath = `/articles/${content.id}`;

  const excerpt = content.body.substring(0, 200).replace(/[#*_`]/g, '').trim();

  return (
    <Link to={linkPath} className="block group">
      <article className="border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all">
        {content.coverImage && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={content.coverImage.getDirectURL()}
              alt={content.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <h2 className="text-2xl font-light mb-3 group-hover:text-primary transition-colors">
          {content.title}
        </h2>
        <p className="text-muted-foreground mb-4 line-clamp-2">{excerpt}...</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(content.createdAt)}</span>
        </div>
      </article>
    </Link>
  );
}
