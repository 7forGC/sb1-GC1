import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'MMM d, yyyy');
};

export const formatRelativeTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};