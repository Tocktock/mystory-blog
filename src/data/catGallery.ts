import type { ImageMetadata } from 'astro';

import galleryImage1 from '../assets/gallery/1.jpg';
import galleryImage2 from '../assets/gallery/2.jpg';
import galleryImage3 from '../assets/gallery/3.jpg';
import galleryImage4 from '../assets/gallery/4.jpg';
import galleryImage5 from '../assets/gallery/5.jpg';
import galleryImage6 from '../assets/gallery/6.jpg';

export interface CatPhoto {
  image: ImageMetadata;
  alt: string;
}

export const catPhotos: CatPhoto[] = [
  { image: galleryImage1, alt: 'Cat lounging near a window with soft lighting.' },
  { image: galleryImage2, alt: 'Curious cat peeking through a fence.' },
  { image: galleryImage3, alt: 'Playful kitten reaching for a toy.' },
  { image: galleryImage4, alt: 'Cat resting comfortably on a blanket.' },
  { image: galleryImage5, alt: 'Two cats sharing a quiet moment together.' },
  { image: galleryImage6, alt: 'Cat gazing outside with bright eyes.' },
];
