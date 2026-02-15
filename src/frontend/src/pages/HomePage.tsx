import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[60vh]">
      <div className="relative overflow-hidden rounded-2xl mb-16">
        <img
          src="/assets/generated/hero-banner.dim_1600x500.png"
          alt="Hero banner"
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20 flex items-end">
          <div className="p-12">
            <h1 className="text-5xl font-light tracking-tight mb-4">Welcome to My Collection</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Explore my thoughts, ideas, and creative works through in-depth articles.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Link to="/articles" className="group">
          <div className="border border-border rounded-xl p-8 hover:border-primary/50 transition-all hover:shadow-lg">
            <BookOpen className="w-12 h-12 mb-4 text-primary" />
            <h2 className="text-2xl font-light mb-3">Articles</h2>
            <p className="text-muted-foreground mb-6">
              In-depth explorations and long-form writing on topics that matter.
            </p>
            <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
              Browse Articles →
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
