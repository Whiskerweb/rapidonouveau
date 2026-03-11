import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rapido-devis.fr';

    // Core Static Pages
    const staticPages = [
        '',
        '/nos-tarifs',
        '/notre-solution',
        '/a-propos',
        '/contact',
        '/actualites',
        '/fonctionnalites/scan-ia',
        '/fonctionnalites/expertise-humaine',
        '/fonctionnalites/mobile',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Métiers Pages
    const metiers = ['maconnerie', 'peinture', 'electricite', 'plomberie', 'menuiserie'].map((slug) => ({
        url: `${baseUrl}/metiers/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Blog Posts (Actualités)
    const posts = [
        'ia-batiment-revolution-ou-gadget',
        'gerer-inflation-chantiers-2024',
        'secrets-devis-valide-banque',
    ].map((slug) => ({
        url: `${baseUrl}/actualites/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...metiers, ...posts];
}
