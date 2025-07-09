export interface PlatformSettings {
    general: {
        siteName: string;
        siteDescription: string;
        contactEmail: string;
        supportEmail: string;
        defaultLanguage: string;
        timezone: string;
        allowRegistration: boolean;
        requireEmailVerification: boolean;
        maintenanceMode: boolean;
    };
    security: {
        passwordMinLength: number;
        requireStrongPasswords: boolean;
        sessionTimeout: number;
        maxLoginAttempts: number;
        enableTwoFactor: boolean;
        allowPasswordReset: boolean;
    };
    email: {
        smtpHost: string;
        smtpPort: number;
        smtpUser: string;
        smtpPassword: string;
        fromEmail: string;
        fromName: string;
        enableEmailNotifications: boolean;
    };
    content: {
        maxFileSize: number;
        allowedFileTypes: string[];
        autoModeration: boolean;
        requireApproval: boolean;
        enableComments: boolean;
        enableRatings: boolean;
    };
    appearance: {
        primaryColor: string;
        secondaryColor: string;
        logo: string;
        favicon: string;
        customCSS: string;
        darkModeEnabled: boolean;
    };
    notifications: {
        newUserSignup: boolean;
        newMuseumApplication: boolean;
        contentFlagged: boolean;
        systemAlerts: boolean;
        weeklyReports: boolean;
        emailDigest: boolean;
    };
}