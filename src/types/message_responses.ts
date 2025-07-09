export interface ResponseMessage {
    id: string;
    contactMessageId: string;
    respondedBy: string; // User ID who responded
    subject: string;
    message: string;
    emailSent: string;
    emailSentAt: string;
    templateUsed: string; // Template ID if used
    createdAt: Date | string
} 
