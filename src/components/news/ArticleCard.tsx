'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { NewsArticle } from './types';
import { categoryColors, categoryLabels } from './types';

interface ArticleCardProps {
  article: NewsArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <a href={article.sourceUrl} className="block group">
      <Card className="overflow-hidden py-0 gap-0 transition-shadow duration-300 group-hover:shadow-lg border-gray-200">
        {/* Image */}
        <div className="aspect-video overflow-hidden relative">
          <img
            src={article.imageUrl || 'https://picsum.photos/seed/article/400/225'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <Badge className={`${categoryColors[article.category] || 'bg-red-600'} text-white border-0 text-[10px] px-2 py-0.5`}>
              {categoryLabels[article.category] || article.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#e00000] transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {article.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium text-gray-500">{article.sourceName}</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
