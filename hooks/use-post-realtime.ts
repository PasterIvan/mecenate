import { useEffect, useRef } from 'react';

import { Comment } from '@/types/feed';

type LikeUpdatedEvent = {
  type: 'like_updated';
  postId: string;
  likesCount: number;
};

type CommentAddedEvent = {
  type: 'comment_added';
  postId: string;
  comment: Comment;
};

type PingEvent = {
  type: 'ping';
};

type RealtimeEvent = LikeUpdatedEvent | CommentAddedEvent | PingEvent;

type UsePostRealtimeParams = {
  url: string;
  onLikeUpdated: (event: LikeUpdatedEvent) => void;
  onCommentAdded: (event: CommentAddedEvent) => void;
};

export function usePostRealtime({ url, onLikeUpdated, onCommentAdded }: UsePostRealtimeParams) {
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;
    let socket: WebSocket | null = null;

    const connect = () => {
      if (!isMounted) {
        return;
      }

      socket = new WebSocket(url);

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as RealtimeEvent;
          if (payload.type === 'like_updated') {
            onLikeUpdated(payload);
          } else if (payload.type === 'comment_added') {
            onCommentAdded(payload);
          }
        } catch {
          // Ignore invalid payloads from transport.
        }
      };

      socket.onclose = () => {
        if (!isMounted) {
          return;
        }

        reconnectTimeoutRef.current = setTimeout(connect, 2000);
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socket?.close();
    };
  }, [onCommentAdded, onLikeUpdated, url]);
}
