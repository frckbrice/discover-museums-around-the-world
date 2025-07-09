import { API_URL } from '@/lib/constants';
import MuseumProfilePage from '@/page-components/public/MuseumProfilePage';
import { Museum } from '@/types';
import React from 'react'

type Props = {
    params: Promise<{ id: string }>
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams(): Promise<{ id: string }[]> {
    try {
        const response = await fetch(`${API_URL}/museums`);

        if (!response.ok) {
            console.error('Failed to fetch museums for static generation');
            return []; // Return empty array to prevent build failure
        }

        const museums: Museum[] = await response.json();

        return museums.map((museum) => ({
            id: museum.id.toString(), // Ensure string type
        }));
    } catch (error) {
        console.error('Error in generateStaticParams:', error);
        return []; // Fallback to prevent build failure
    }
}

//  Generate metadata
export async function generateMetadata({ params }: Props) {
    const { id } = await params;

    try {
        const museum = await fetch(`${API_URL}/museums/${id}`).then(res => res.json());
        return {
            title: museum.name,
            description: museum.description,
        };
    } catch {
        return {
            title: 'Museum Profile',
        };
    }
}


export default async function MuseumProfilPage({ params }: Props) {
    const { id } = await params;

    return (
        <MuseumProfilePage museumId={id} />
    )
}
