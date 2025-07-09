import { API_URL } from '@/lib/constants';
import StoryDetailPage from '@/page-components/public/StoryDetailPage';
import { Story } from '@/types';
import React from 'react'

type Props = {
    params: Promise<{ id: string }>
};

export async function generateStaticParams(): Promise<{ id: string }[]> {
    try {
        const response = await fetch(`${API_URL}/stories`);

        if (!response.ok) {
            console.error('Failed to fetch museums for static generation');
            return []; // Return empty array to prevent build failure
        }

        const stories: Story[] = await response.json();

        return stories.map((story: Story) => ({
            id: story.id,
        }));
    } catch (error) {
        console.error('Error in generateStaticParams:', error);
        return []; // Fallback to prevent build failure
    }
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;

    try {
        const story = await fetch(`${API_URL}/stories/${id}`).then(res => res.json());
        return {
            title: story.name,
            description: story.description,
        };
    } catch {
        return {
            title: 'story title',
        };
    }
}

export default async function StoryDetail({ params }: Props) {
    const { id } = await params;

    return (
        <StoryDetailPage storyId={id} />
    )
}
