// src/utils/storage.ts

const KEYS = {
    TOKEN: "auth_token",
    THEME: "theme_mode",
    USER: "user_data",
};

class Storage {
    private storage: globalThis.Storage;

    constructor(useSession = false) {
        // default: pakai localStorage
        this.storage = useSession ? sessionStorage : localStorage;
    }

    async setItem(key: string, value: string): Promise<void> {
        this.storage.setItem(key, value);
    }

    async getItem(key: string): Promise<string | null> {
        return this.storage.getItem(key);
    }

    async removeItem(key: string): Promise<void> {
        this.storage.removeItem(key);
    }

    // --------------------------
    // Helper methods
    // --------------------------
    getTokenSync(): string | null {
        return this.storage.getItem("auth_token");
    }

    async setToken(token: string): Promise<void> {
        await this.setItem(KEYS.TOKEN, token);
    }

    async getToken(): Promise<string | null> {
        return await this.getItem(KEYS.TOKEN);
    }

    async removeToken(): Promise<void> {
        await this.removeItem(KEYS.TOKEN);
    }

    async setThemeMode(mode: string): Promise<void> {
        await this.setItem(KEYS.THEME, mode);
    }

    async getThemeMode(): Promise<string | null> {
        return await this.getItem(KEYS.THEME);
    }

    async setUserData(data: any): Promise<void> {
        await this.setItem(KEYS.USER, JSON.stringify(data));
    }

    async getUserData(): Promise<any | null> {
        const data = await this.getItem(KEYS.USER);
        return data ? JSON.parse(data) : null;
    }

    async clearAll(): Promise<void> {
        this.storage.removeItem(KEYS.TOKEN);
        this.storage.removeItem(KEYS.THEME);
        this.storage.removeItem(KEYS.USER);
    }
}

export const storage = new Storage();
