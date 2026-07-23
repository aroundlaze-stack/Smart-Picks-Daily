import { useEffect } from 'react';
import { ExternalLink, BarChart3, ArrowRight } from 'lucide-react';

export default function ProductCompare() {
  const openCompare = () => {
    window.open('/compare', '_blank');
  };

  useEffect(() => {
    // Auto-open the comparison page when this tool mounts
    const timer = setTimeout(() => openCompare(), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <BarChart3 size={28} className="text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">Smart Product Comparison</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          A new tab has been opened with the full comparison tool.
          Compare up to 4 products side-by-side with smart recommendations.
        </p>
      </div>
      <button onClick={openCompare}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors">
        Open Comparison <ExternalLink size={14} />
      </button>
      <p className="text-xs text-muted-foreground">
        If the page didn't open automatically, click the button above.
      </p>
    </div>
  );
}
