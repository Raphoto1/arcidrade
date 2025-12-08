import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const lastModified = new Date()

  // Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // TODO: Aquí podrías agregar páginas dinámicas si tienes:
  // - Páginas de ofertas públicas
  // - Blog posts
  // - Páginas de especialidades
  // - Páginas de ciudades
  
  return staticPages
}