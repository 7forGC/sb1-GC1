import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PostItemProps {
  index: number;
  isLiked: boolean;
  onLike: () => void;
}

export const PostItem: React.FC<PostItemProps> = ({ index, isLiked, onLike }) => {
  const { t } = useTranslation();

  return (
    <article className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-purple-600 to-pink-600">
            <img
              src={`https://source.unsplash.com/random/50x50?face=${index}`}
              alt={`User ${index}`}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm">User {index}</h3>
            <p className="text-xs text-gray-500">
              {t('post.timeAgo', { time: '2 ' + t('post.hours') })}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <img
        src={`https://source.unsplash.com/random/600x600?nature=${index}`}
        alt="Post content"
        className="w-full aspect-square object-cover"
      />

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onLike}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ${
                isLiked ? 'text-red-500' : ''
              }`}
              title={t('actions.like')}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200" title={t('actions.comment')}>
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200" title={t('actions.share')}>
              <Share2 className="w-6 h-6" />
            </button>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200" title={t('actions.save')}>
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-sm">{t('post.likes', { count: '1,234' })}</p>
          <p className="text-sm">
            <span className="font-semibold">User {index}</span>{' '}
            Beautiful nature captured in its purest form. #nature #photography
          </p>
          <button className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200">
            {t('post.viewComments', { count: 48 })}
          </button>
        </div>
      </div>
    </article>
  );
};