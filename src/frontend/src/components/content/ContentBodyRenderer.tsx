import { useEffect, useRef } from 'react';

interface ContentBodyRendererProps {
  body: string;
}

export default function ContentBodyRenderer({ body }: ContentBodyRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Parse markdown-style images and convert to img tags
      let html = body;
      
      // Convert markdown images: ![alt](url)
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="content-image" />');
      
      // Convert markdown headers
      html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
      html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
      html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
      
      // Convert markdown bold
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      
      // Convert markdown italic
      html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
      
      // Convert line breaks to paragraphs
      html = html.split('\n\n').map(para => {
        if (para.trim() && !para.startsWith('<')) {
          return `<p>${para.trim()}</p>`;
        }
        return para;
      }).join('\n');
      
      contentRef.current.innerHTML = html;
    }
  }, [body]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none
        prose-headings:font-light prose-headings:tracking-tight
        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
        prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10
        prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
        prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
        prose-img:rounded-xl prose-img:my-8 prose-img:w-full prose-img:h-auto
        prose-strong:text-foreground prose-strong:font-medium
        prose-em:text-foreground"
    />
  );
}
