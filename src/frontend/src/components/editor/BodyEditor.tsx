import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import ImageUploadPanel from './ImageUploadPanel';

interface BodyEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function BodyEditor({ value, onChange, disabled = false }: BodyEditorProps) {
  const [showImagePanel, setShowImagePanel] = useState(false);

  const handleImageUploaded = (url: string) => {
    const imageMarkdown = `![Image](${url})`;
    onChange(value + (value ? '\n\n' : '') + imageMarkdown);
    setShowImagePanel(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          Supports markdown: **bold**, *italic*, # headers, ![alt](url) for images
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowImagePanel(!showImagePanel)}
          disabled={disabled}
        >
          <Image className="w-4 h-4 mr-2" />
          Insert Image
        </Button>
      </div>

      {showImagePanel && (
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <ImageUploadPanel
            currentImageUrl=""
            onImageUploaded={handleImageUploaded}
            label="Upload image to insert"
            disabled={disabled}
          />
        </div>
      )}

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your article content here..."
        className="min-h-[400px] font-mono text-sm"
        disabled={disabled}
      />
    </div>
  );
}
