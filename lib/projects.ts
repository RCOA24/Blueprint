export type Project = {
  slug: string;
  name: string;
  place: string;
  year: string;
  category: string;
  cover: string;
  images: string[];
  desc: string;
};
export const projects: Project[] = [
  {
    slug: 'north-side',
    name: 'Building Construction',
    place: 'North Side',
    year: '2023',
    category: 'Construction',
    cover: 'gallery-5.jpg',
    images: ['gallery-5.jpg', 'gallery-6.jpg', 'gallery-7.jpg'],
    desc: 'Construction progress at the Building Construction project in North Side, as featured in the Blueprint Group gallery.',
  },
  {
    slug: 'fence-installation-and-repair',
    name: 'Fence Installation and Repair',
    place: 'Cayman Islands',
    year: '',
    category: 'Fencing',
    cover: 'gallery-10.jpeg',
    images: [
      'gallery-10.jpeg',
      'gallery-8.jpeg',
      'gallery-9.jpeg',
      'gallery-11.jpeg',
      'gallery-1.jpg',
      'gallery-2.jpg',
      'gallery-3.jpg',
      'gallery-4.jpg',
    ],
    desc: 'Fence installation and repair projects across the Cayman Islands.',
  },
  {
    slug: 'architectural-design-plans',
    name: 'Architectural Design Plans',
    place: 'Cayman Islands',
    year: '',
    category: 'Architecture',
    cover: 'Floor plan placeholder 02.png',
    images: [
      'Cayman Islands Tropical Residence Blueprint.png',
      'Cayman Islands Hurricane-Resilient House Blueprint.png',
      'Cayman Islands Tropical Blueprint Home.png',
      'Cayman Coastal Villa Blueprint Presentation.png',
      'Cayman Islands Coastal Blueprint.png',
      'Cayman Islands Residence Blueprint Board.png',
    ],
    desc: 'Architectural design plans for homes in the Cayman Islands.',
  },
];
