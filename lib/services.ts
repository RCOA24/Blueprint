export type Service = {
  slug: string;
  name: string;
  short: string;
  image: string;
  title: string;
  intro: string;
  items: [string, string][];
};
export const services: Service[] = [
  {
    slug: 'general-construction',
    name: 'Blueprint Construction',
    short: 'From new homes to commercial and industrial spaces. Built around your vision.',
    image: 'construction.jpg',
    title: 'A strong foundation.\nA lasting result.',
    intro:
      'Residential, commercial and industrial construction, with the experience to bring your project from concept to completion.',
    items: [
      [
        'Residential construction',
        'Homes shaped around the way you live, from contemporary designs to classic styles.',
      ],
      [
        'Commercial & industrial',
        'Offices, retail environments and industrial projects, with attention to function and quality.',
      ],
      [
        'Project management',
        'Construction oversight that keeps the work connected to the original design.',
      ],
      [
        'Sustainable construction',
        'Building approaches that consider materials, efficiency and environmental impact.',
      ],
    ],
  },
  {
    slug: 'architectural-services',
    name: 'Blueprint Architecture',
    short: 'Thoughtful concepts, detailed plans and 3D visualizations that bring ideas into focus.',
    image: 'architecture.jpg',
    title: 'Thoughtfully designed.\nDistinctly yours.',
    intro:
      'Bring your ideas into focus through collaborative design, detailed planning and architectural oversight.',
    items: [
      [
        'Conceptual design',
        'Explore a visual direction that reflects your priorities and the way the space will be used.',
      ],
      [
        'Detailed planning',
        'Develop spatial arrangements and material selections into a considered design.',
      ],
      [
        '3D modelling & visualization',
        'See your project before construction and make informed design decisions.',
      ],
      ['Architectural oversight', 'Carry the design intent through to the work on site.'],
    ],
  },
  {
    slug: 'remodeling',
    name: 'Remodeling & renovation',
    short: 'A fresh perspective on existing spaces, from interiors to complete transformations.',
    image: 'remodeling.jpg',
    title: 'New possibilities.\nIn familiar spaces.',
    intro:
      'Reimagine your home or business with renovations that bring together function, character and careful craftsmanship.',
    items: [
      ['Home renovations', 'Update kitchens, bathrooms and living spaces to suit your needs.'],
      [
        'Commercial transformations',
        'Adapt your business environment as your requirements evolve.',
      ],
      [
        'Structural changes',
        'Explore room additions, floor plan changes and exterior transformations.',
      ],
      [
        'Energy-efficient upgrades',
        'Consider technologies and materials that improve the efficiency of your space.',
      ],
    ],
  },
  {
    slug: 'blueprint-fencing',
    name: 'Blueprint Fencing',
    short: 'Perimeter solutions that bring security, durability and design together.',
    image: 'fencing.jpg',
    title: 'Define your space.\nProtect what matters.',
    intro:
      'Fencing and perimeter solutions for residential, commercial and industrial properties across the Cayman Islands.',
    items: [
      [
        'Chain link fencing',
        'Boundary fencing and enclosures with galvanized or vinyl-coated options and a choice of heights.',
      ],
      [
        'Timber & vinyl fencing',
        'Explore fencing options to complement your property and privacy requirements.',
      ],
      [
        'Specialist enclosures',
        'Solutions for sports areas, dog enclosures, garbage enclosures and commercial sites.',
      ],
      [
        'Security & perimeter systems',
        'Discuss high-security fencing, gates and access control requirements with the team.',
      ],
    ],
  },
];
