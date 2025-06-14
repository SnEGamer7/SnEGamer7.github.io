// Avatar Generator System
class AvatarGenerator {
    constructor() {
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F4D03F'
        ];
    }

    // Generate initials from username
    getInitials(username) {
        if (!username) return 'U';
        
        // Handle single word usernames
        if (username.length === 1) return username.toUpperCase();
        
        // For usernames with multiple characters, take first and last if possible
        const cleaned = username.replace(/[^a-zA-Z0-9]/g, '');
        if (cleaned.length >= 2) {
            return (cleaned[0] + cleaned[cleaned.length - 1]).toUpperCase();
        }
        
        return cleaned[0].toUpperCase();
    }

    // Generate color based on username
    getColorFromUsername(username) {
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
        return this.colors[Math.abs(hash) % this.colors.length];
    }

    // Generate SVG avatar
    generateSVGAvatar(username, size = 100) {
        const initials = this.getInitials(username);
        const backgroundColor = this.getColorFromUsername(username);
        const textColor = this.getContrastColor(backgroundColor);
        const fontSize = size * 0.4;

        const svg = `
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
                <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${backgroundColor}"/>
                <text x="${size/2}" y="${size/2}" font-family="Orbitron, sans-serif" font-size="${fontSize}" 
                      font-weight="600" text-anchor="middle" dominant-baseline="central" fill="${textColor}">
                    ${initials}
                </text>
            </svg>
        `;

        return svg;
    }

    // Generate data URL for avatar
    generateAvatarDataURL(username, size = 100) {
        const svg = this.generateSVGAvatar(username, size);
        const base64 = btoa(unescape(encodeURIComponent(svg)));
        return `data:image/svg+xml;base64,${base64}`;
    }

    // Get contrast color (white or black) based on background
    getContrastColor(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    // Generate and set avatar for element
    setAvatarForElement(element, username, size = 100) {
        const dataURL = this.generateAvatarDataURL(username, size);
        element.src = dataURL;
        element.alt = `${username} avatar`;
    }
}

// Initialize avatar generator
const avatarGenerator = new AvatarGenerator();
