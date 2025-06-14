// User Management System
class UserSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.initializeDefaultAdmin();
    }

    // Initialize default admin account
    initializeDefaultAdmin() {
        const adminUsername = 'SnEgamer';
        if (!this.users[adminUsername]) {
            this.users[adminUsername] = {
                username: adminUsername,
                password: 'Bjdogblueapple!1',
                email: 'admin@spicymatters.dev',
                role: 'developer',
                profilePic: null, // Will be generated
                preferences: {
                    theme: 'cyberpunk',
                    notifications: true,
                    emailUpdates: true
                },
                createdAt: new Date().toISOString(),
                lastLogin: null
            };
            this.saveUsers();
        }
    }

    // Password validation
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const errors = [];
        if (password.length < minLength) errors.push('Password must be at least 8 characters long');
        if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
        if (!hasNumber) errors.push('Password must contain at least one number');
        if (!hasSpecialChar) errors.push('Password must contain at least one special character');

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // Register new user
    register(userData) {
        const { username, password, email, confirmPassword } = userData;

        // Validation
        if (!username || !password || !email || !confirmPassword) {
            return { success: false, message: 'All fields are required' };
        }

        if (this.users[username]) {
            return { success: false, message: 'Username already exists' };
        }

        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }

        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.valid) {
            return { success: false, message: passwordValidation.errors.join('. ') };
        }

        // Create new user
        this.users[username] = {
            username,
            password, // In production, this should be hashed
            email,
            role: 'user',
            profilePic: null, // Will be generated
            preferences: {
                theme: 'cyberpunk',
                notifications: true,
                emailUpdates: false
            },
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        this.saveUsers();
        return { success: true, message: 'Account created successfully!' };
    }

    // Login user
    login(username, password) {
        if (!this.users[username]) {
            return { success: false, message: 'Invalid username or password' };
        }

        const user = this.users[username];
        if (user.password !== password) {
            return { success: false, message: 'Invalid username or password' };
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        this.currentUser = user;
        this.saveCurrentUser();
        this.saveUsers();

        return { success: true, message: 'Login successful!', user };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Update user preferences
    updatePreferences(preferences) {
        if (!this.currentUser) return false;

        this.users[this.currentUser.username].preferences = {
            ...this.users[this.currentUser.username].preferences,
            ...preferences
        };
        this.currentUser.preferences = this.users[this.currentUser.username].preferences;
        
        this.saveUsers();
        this.saveCurrentUser();
        return true;
    }

    // Update profile picture
    updateProfilePic(picUrl) {
        if (!this.currentUser) return false;

        this.users[this.currentUser.username].profilePic = picUrl;
        this.currentUser.profilePic = picUrl;
        
        this.saveUsers();
        this.saveCurrentUser();
        return true;
    }

    // Storage methods
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    loadUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : {};
    }

    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    loadCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is admin/developer
    isAdmin() {
        return this.currentUser && (this.currentUser.role === 'developer' || this.currentUser.role === 'admin');
    }

    // Get user profile picture (generated or custom)
    getUserProfilePic(username) {
        const user = this.users[username];
        if (!user) return null;
        
        // If user has custom profile pic, use it
        if (user.profilePic && user.profilePic.startsWith('http')) {
            return user.profilePic;
        }
        
        // Otherwise generate avatar from initials
        return avatarGenerator.generateAvatarDataURL(username, 100);
    }

    // Update profile picture with custom image
    updateCustomProfilePic(picUrl) {
        if (!this.currentUser) return false;

        this.users[this.currentUser.username].profilePic = picUrl;
        this.currentUser.profilePic = picUrl;
        
        this.saveUsers();
        this.saveCurrentUser();
        return true;
    }

    // Reset to generated avatar
    resetToGeneratedAvatar() {
        if (!this.currentUser) return false;

        this.users[this.currentUser.username].profilePic = null;
        this.currentUser.profilePic = null;
        
        this.saveUsers();
        this.saveCurrentUser();
        return true;
    }
}

// Initialize user system
const userSystem = new UserSystem();
