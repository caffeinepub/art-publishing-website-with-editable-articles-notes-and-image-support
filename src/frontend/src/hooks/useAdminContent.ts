import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAdminSession } from './useAdminSession';
import { Article } from '../backend';
import { ExternalBlob } from '../backend';

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllArticles() {
  const { actor, isFetching } = useActor();
  const { token } = useAdminSession();

  return useQuery<Article[]>({
    queryKey: ['allArticles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticles(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useGetArticleById(id: string) {
  const { actor, isFetching } = useActor();
  const { token } = useAdminSession();

  return useQuery<Article | null>({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getArticleById(id, token);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const { token } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      body,
      coverImage,
    }: {
      title: string;
      body: string;
      coverImage: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createArticle(title, body, coverImage, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      queryClient.invalidateQueries({ queryKey: ['publishedArticles'] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const { token } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      body,
      coverImage,
    }: {
      id: string;
      title: string;
      body: string;
      coverImage: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateArticle(id, title, body, coverImage, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      queryClient.invalidateQueries({ queryKey: ['article', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['publishedArticles'] });
    },
  });
}

export function usePublishArticle() {
  const { actor } = useActor();
  const { token } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishArticle(id, token);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      queryClient.invalidateQueries({ queryKey: ['publishedArticles'] });
    },
  });
}

export function useUnpublishArticle() {
  const { actor } = useActor();
  const { token } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unpublishArticle(id, token);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      queryClient.invalidateQueries({ queryKey: ['publishedArticles'] });
    },
  });
}
