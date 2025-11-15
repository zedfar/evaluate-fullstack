import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type SSEPayload = {
    fields: { field: string; value: string }[];
    timeframe: { from: number; to: number; timeZone: string };
    summary: string;
    language: string;
};

type UseSSEPostOptions<T> = {
    url: string;
    payload: SSEPayload;
    queryKey: readonly unknown[];
    token: string;
    onError?: (err: any) => void;
    onMessage?: (msg: T) => void;
    onComplete?: () => void;
    autoStart: boolean;
};

export function useSSEPost<T = any>({
    url,
    payload,
    queryKey,
    token,
    onError,
    onMessage,
    onComplete,
    autoStart = false,
}: UseSSEPostOptions<T>) {


    const queryClient = useQueryClient();
    const abortControllerRef = useRef<AbortController | null>(null);
    const hasExecutedRef = useRef(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const mutation = useMutation({
        mutationFn: async () => {
            setIsLoading(true);
            setIsError(false);

            // Buat AbortController baru untuk request ini
            abortControllerRef.current = new AbortController();

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                },
                body: JSON.stringify(payload),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error("Response body is not readable");
            }

            const decoder = new TextDecoder();
            let buffer = "";

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (line.startsWith("data:")) {
                            try {
                                const dataStr = line.slice(5).trim();
                                if (dataStr) {
                                    const parsed: T = JSON.parse(dataStr);
                                    queryClient.setQueryData<T[]>(queryKey, (old = []) => [
                                        ...old,
                                        parsed,
                                    ]);
                                    onMessage?.(parsed);
                                }
                            } catch (err) {
                                console.error("Failed to parse SSE line:", err);
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
                setIsLoading(false);
            }

            onComplete?.();
        },
        onError: (err: any) => {
            setIsLoading(false);
            if (err.name === "AbortError") {
                console.log("SSE request was aborted");
                return;
            }
            setIsError(true);
            console.error("Mutation error:", err);
            onError?.(err);
        },
    });


    // Manual start function
    const start = () => {
        mutation.mutate();
    };

    // Manual stop function
    const stop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    useEffect(() => {
        if (autoStart) {
            if (hasExecutedRef.current) return;
            hasExecutedRef.current = true;
            
            mutation.mutate();
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [autoStart]);

    return {
        isLoading,
        isError,
        data: mutation.data,
        error: mutation.error,
        start,  // ← Expose manual controls
        stop,
    };
}