import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Article } from '../backend';

export function useGetPublishedArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['publishedArticles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticleById(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Article | null>({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getArticleById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
