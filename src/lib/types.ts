export interface Video {
    id: string;
    created_at: string;
    original_name: string;
    processed_url: string;
}

export type Database = {
    public: {
        Tables: {
            videos: {
                Row: {
                    id: string;
                    created_at: string;
                    user_id: string | null;
                    original_name: string | null;
                    processed_url: string | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    user_id?: string | null;
                    original_name?: string | null;
                    processed_url?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    user_id?: string | null;
                    original_name?: string | null;
                    processed_url?: string | null;
                };
            };
            processed_videos: {
                Row: {
                    id: string;
                    created_at: string;
                    user_id: string | null;
                    url: string | null;
                    captions: string | null;
                    status: string | null;
                    broll_type: string | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    user_id?: string | null;
                    url?: string | null;
                    captions?: string | null;
                    status?: string | null;
                    broll_type?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    user_id?: string | null;
                    url?: string | null;
                    captions?: string | null;
                    status?: string | null;
                    broll_type?: string | null;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
    };
};