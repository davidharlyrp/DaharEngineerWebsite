export const cookieUtils = {
    set: (name: string, value: string, days: number = 365) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    },
    get: (name: string): string | null => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    remove: (name: string) => {
        document.cookie = name + '=; Max-Age=-99999999;';
    },

    // Interaction specific helpers
    isLiked: (type: 'blog' | 'comment', id: string): boolean => {
        const likedIds = cookieUtils.get(`liked_${type}s`);
        if (!likedIds) return false;
        return likedIds.split(',').includes(id);
    },

    addLike: (type: 'blog' | 'comment', id: string) => {
        const key = `liked_${type}s`;
        const likedIds = cookieUtils.get(key);
        const ids = likedIds ? likedIds.split(',') : [];
        if (!ids.includes(id)) {
            ids.push(id);
            cookieUtils.set(key, ids.join(','));
        }
    },

    removeLike: (type: 'blog' | 'comment', id: string) => {
        const key = `liked_${type}s`;
        const likedIds = cookieUtils.get(key);
        if (!likedIds) return;
        const ids = likedIds.split(',').filter(item => item !== id);
        cookieUtils.set(key, ids.join(','));
    }
};
