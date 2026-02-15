import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import RequireAdmin from '../../components/auth/RequireAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useCreateArticle, useUpdateArticle, useGetArticleById } from '../../hooks/useAdminContent';
import { toast } from 'sonner';
import BodyEditor from '../../components/editor/BodyEditor';
import ImageUploadPanel from '../../components/editor/ImageUploadPanel';
import { ExternalBlob } from '../../backend';

interface ContentEditorPageProps {
  mode: 'create' | 'edit';
}

function ContentEditorContent({ mode }: ContentEditorPageProps) {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  const { data: existingArticle, isLoading: loadingArticle } = useGetArticleById(
    mode === 'edit' ? (id as string) : ''
  );

  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  useEffect(() => {
    if (mode === 'edit' && existingArticle) {
      setTitle(existingArticle.title);
      setBody(existingArticle.body);
      if (existingArticle.coverImage) {
        setCoverImageUrl(existingArticle.coverImage.getDirectURL());
      }
    }
  }, [mode, existingArticle]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const coverImage = coverImageUrl ? ExternalBlob.fromURL(coverImageUrl) : null;

    try {
      if (mode === 'create') {
        await createMutation.mutateAsync({
          title: title.trim(),
          body,
          coverImage,
        });
        toast.success('Article created successfully');
      } else {
        await updateMutation.mutateAsync({
          id: id as string,
          title: title.trim(),
          body,
          coverImage,
        });
        toast.success('Article updated successfully');
      }
      navigate({ to: '/admin' });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to save article';
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('admin')) {
        toast.error('Owner access required to save articles');
      } else {
        toast.error('Failed to save article');
      }
      console.error(error);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (mode === 'edit' && loadingArticle) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <h1 className="text-4xl font-light tracking-tight mb-2">
          {mode === 'create' ? 'Create' : 'Edit'} Article
        </h1>
      </div>

      <div className="space-y-8">
        <div>
          <Label htmlFor="title" className="text-base mb-2 block">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title..."
            className="text-lg"
            disabled={isSaving}
          />
        </div>

        <ImageUploadPanel
          currentImageUrl={coverImageUrl}
          onImageUploaded={setCoverImageUrl}
          label="Cover Image (optional)"
          disabled={isSaving}
        />

        <div>
          <Label className="text-base mb-2 block">Body</Label>
          <BodyEditor value={body} onChange={setBody} disabled={isSaving} />
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-border">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Article
              </>
            )}
          </Button>
          <Link to="/admin">
            <Button variant="outline" size="lg" disabled={isSaving}>
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ContentEditorPage(props: ContentEditorPageProps) {
  return (
    <RequireAdmin>
      <ContentEditorContent {...props} />
    </RequireAdmin>
  );
}
