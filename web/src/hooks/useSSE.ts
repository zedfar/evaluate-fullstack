import { useEffect, useState } from 'react';

interface SSEMessage {
  type: string;
  data: any;
}

export const useSSE = (url: string, enabled: boolean = true) => {
  const [message, setMessage] = useState<SSEMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`${url}?token=${token}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessage(data);
      } catch (err) {
        console.error('Error parsing SSE message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      setError('Connection error');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url, enabled]);

  return { message, error };
};

export const mockSSE = () => {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomProduct = {
        id: Math.random().toString(36).substr(2, 9),
        name: `New Product ${Math.floor(Math.random() * 1000)}`,
        price: Math.floor(Math.random() * 10000000),
      };

      setNotification({
        type: 'new_product',
        data: randomProduct,
        timestamp: new Date().toISOString(),
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return notification;
};
