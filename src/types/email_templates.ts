export interface EmailTemplate {
    id: string;
    museumId: string;
    name: string;
    subject: string;
    content: string;
    isDefault: boolean,
    createdAt: Date | string;
    updatedAt: Date | string;
}
