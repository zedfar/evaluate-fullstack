import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSSEPost, type SSEPayload } from "@/hooks/useSSEPost";

type ExecutiveSummary = {
    province_code: string;
    city_code: string;
    alert_level: string;
};

const QUERY_KEY = ["executiveSummary"] as const;


export default function TesPage() {
    const [filters, setFilters] = useState({
        fields: [
            { field: "province_code", value: "" },
            { field: "city_code", value: "" },
            { field: "alert_level", value: "" },
        ],
        timeframe: {
            from: 1762707600000,
            to: 1762966799999,
            timeZone: "Asia/Jakarta",
        },
        summary: "adv",
        language: "id",
    });

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..rnOrtj6chTfpb7i6SadVbumjxNkrjZ5XUBWz3wst-4I";


    const { isLoading, isError, start, stop } = useSSEPost<ExecutiveSummary>({
        url: "",
        payload: filters,
        token,
        queryKey: QUERY_KEY,
        autoStart: true,
        onError: (err) => console.error("SSE Error:", err),
        onMessage: (msg) => console.log("New SSE message:", msg),
    });

    // Trigger manual
    // const handleFetchData = () => {
    //     start();
    // };


    const { data = [] } = useQuery<ExecutiveSummary[]>({
        queryKey: QUERY_KEY,
        queryFn: () => [],
        initialData: [],
        enabled: false,
    });

    console.log(data);


    // useEffect(() => {
    //     start()
    // }, [])


    return (
        <div style={{ padding: "20px" }}>
            <h1>Executive Summary SSE</h1>

            {isLoading && <div style={{ color: "#0066cc" }}>Connecting to SSE...</div>}
            {isError && <div style={{ color: "#cc0000" }}>Connection error. Check console.</div>}

            {data.length === 0 && !isLoading && (
                <div style={{ color: "#666" }}>No data received yet...</div>
            )}

            {data.length > 0 && (
                <div>
                    <p style={{ color: "#666", marginBottom: "10px" }}>
                        Received {data.length} message{data.length !== 1 ? "s" : ""}
                    </p>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {data.map((msg, idx) => (
                            <li key={idx} style={{ marginBottom: "10px" }}>
                                <pre style={{
                                    background: "#f5f5f5",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    fontSize: "12px",
                                    overflow: "auto"
                                }}>
                                    {JSON.stringify(msg, null, 2)}
                                </pre>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}