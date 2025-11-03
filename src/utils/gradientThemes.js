// Predefined gradient themes for quick switching

export const GRADIENT_THEMES = {
  techguilds: {
    name: 'TechGuilds (Default)',
    colors: ['#2B0E4C', '#6A1B9A', '#00D4FF'],
    description: 'Deep violet → Magenta → Cyan'
  },
  ocean: {
    name: 'Ocean Blue',
    colors: ['#001F3F', '#0074D9', '#7FDBFF'],
    description: 'Navy → Blue → Light Blue'
  },
  sunset: {
    name: 'Sunset',
    colors: ['#FF6B35', '#F7931E', '#C1328E'],
    description: 'Orange → Gold → Magenta'
  },
  forest: {
    name: 'Forest Green',
    colors: ['#0B3D0B', '#2D6A2D', '#6BCF6B'],
    description: 'Dark green → Forest → Light green'
  },
  monochrome: {
    name: 'Monochrome',
    colors: ['#1a1a1a', '#4a4a4a', '#7a7a7a'],
    description: 'Dark gray → Gray → Light gray'
  },
  fire: {
    name: 'Fire',
    colors: ['#8B0000', '#FF4500', '#FFD700'],
    description: 'Dark red → Orange → Gold'
  },
  royal: {
    name: 'Royal Purple',
    colors: ['#1a0033', '#4B0082', '#9370DB'],
    description: 'Deep purple → Indigo → Medium purple'
  },
  arctic: {
    name: 'Arctic',
    colors: ['#0D1B2A', '#1B4965', '#5FA8D3'],
    description: 'Deep navy → Ocean → Sky blue'
  }
};

// Get gradient CSS for a theme
export function getGradientStyle(themeKey = 'techguilds') {
  const theme = GRADIENT_THEMES[themeKey] || GRADIENT_THEMES.techguilds;
  return {
    background: `linear-gradient(120deg, ${theme.colors.join(', ')})`,
    backgroundSize: '200% 200%'
  };
}

// Get all theme options for dropdown
export function getThemeOptions() {
  return Object.entries(GRADIENT_THEMES).map(([key, theme]) => ({
    value: key,
    label: theme.name,
    description: theme.description
  }));
}
