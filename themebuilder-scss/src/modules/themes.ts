interface Theme {
  themeId: number;
  name: string;
  colorScheme: string;
  text: string;
  group: string;
}
const themes: Theme[] = [
  {
    themeId: 1, name: 'generic', colorScheme: 'light', text: 'Light', group: 'Generic',
  },
  {
    themeId: 2, name: 'generic', colorScheme: 'dark', text: 'Dark', group: 'Generic',
  },
  {
    themeId: 13, name: 'generic', colorScheme: 'carmine', text: 'Carmine', group: 'Generic',
  },
  {
    themeId: 14, name: 'generic', colorScheme: 'darkmoon', text: 'Dark Moon', group: 'Generic',
  },
  {
    themeId: 15, name: 'generic', colorScheme: 'softblue', text: 'Soft Blue', group: 'Generic',
  },
  {
    themeId: 16, name: 'generic', colorScheme: 'darkviolet', text: 'Dark Violet', group: 'Generic',
  },
  {
    themeId: 17, name: 'generic', colorScheme: 'greenmist', text: 'Green Mist', group: 'Generic',
  },
  {
    themeId: 9, name: 'generic', colorScheme: 'light-compact', text: 'Light', group: 'Generic Compact',
  },
  {
    themeId: 10, name: 'generic', colorScheme: 'dark-compact', text: 'Dark', group: 'Generic Compact',
  },
  {
    themeId: 18, name: 'generic', colorScheme: 'carmine-compact', text: 'Carmine', group: 'Generic Compact',
  },
  {
    themeId: 19, name: 'generic', colorScheme: 'darkmoon-compact', text: 'Dark Moon', group: 'Generic Compact',
  },
  {
    themeId: 20, name: 'generic', colorScheme: 'softblue-compact', text: 'Soft Blue', group: 'Generic Compact',
  },
  {
    themeId: 21, name: 'generic', colorScheme: 'darkviolet-compact', text: 'Dark Violet', group: 'Generic Compact',
  },
  {
    themeId: 22, name: 'generic', colorScheme: 'greenmist-compact', text: 'Green Mist', group: 'Generic Compact',
  },
  {
    themeId: 43, name: 'generic', colorScheme: 'contrast', text: 'Contrast', group: 'Generic',
  },
  {
    themeId: 44, name: 'generic', colorScheme: 'contrast-compact', text: 'Contrast Compact', group: 'Generic Compact',
  },
  {
    themeId: 23, name: 'material', colorScheme: 'blue-light', text: 'Blue Light', group: 'Material Design',
  },
  {
    themeId: 28, name: 'material', colorScheme: 'blue-dark', text: 'Blue Dark', group: 'Material Design',
  },
  {
    themeId: 24, name: 'material', colorScheme: 'orange-light', text: 'Orange Light', group: 'Material Design',
  },
  {
    themeId: 29, name: 'material', colorScheme: 'orange-dark', text: 'Orange Dark', group: 'Material Design',
  },
  {
    themeId: 25, name: 'material', colorScheme: 'lime-light', text: 'Lime Light', group: 'Material Design',
  },
  {
    themeId: 30, name: 'material', colorScheme: 'lime-dark', text: 'Lime Dark', group: 'Material Design',
  },
  {
    themeId: 26, name: 'material', colorScheme: 'purple-light', text: 'Purple Light', group: 'Material Design',
  },
  {
    themeId: 31, name: 'material', colorScheme: 'purple-dark', text: 'Purple Dark', group: 'Material Design',
  },
  {
    themeId: 27, name: 'material', colorScheme: 'teal-light', text: 'Teal Light', group: 'Material Design',
  },
  {
    themeId: 32, name: 'material', colorScheme: 'teal-dark', text: 'Teal Dark', group: 'Material Design',
  },

  {
    themeId: 33, name: 'material', colorScheme: 'blue-light-compact', text: 'Blue Light Compact', group: 'Material Design (Compact)',
  },
  {
    themeId: 34, name: 'material', colorScheme: 'blue-dark-compact', text: 'Blue Dark Compact', group: 'Material Design (Compact)',
  },
  {
    themeId: 35, name: 'material', colorScheme: 'orange-light-compact', text: 'Orange Light Compact', group: 'Material Design (Compact)',
  },
  {
    themeId: 36, name: 'material', colorScheme: 'orange-dark-compact', text: 'Orange Dark Compact', group: 'Material Design (Compact)',
  },
  {
    themeId: 37, name: 'material', colorScheme: 'lime-light-compact', text: 'Lime Light Compact', group: 'Material Design (Compact)',
  },
  {
    themeId: 38, name: 'material', colorScheme: 'lime-dark-compact', text: 'Lime Dark Compact', group: 'Material Design (Compact)',
  },
  {
    themeId: 39, name: 'material', colorScheme: 'purple-light-compact', text: 'Purple Light Compact', group: 'Material Design (Compact)',
  },
  {
    themeId: 40, name: 'material', colorScheme: 'purple-dark-compact', text: 'Purple Dark Compact', group: 'Material Design (Compact)',
  },
  {
    themeId: 41, name: 'material', colorScheme: 'teal-light-compact', text: 'Teal Light Compact', group: 'Material Design (Compact)',
  },
  {
    themeId: 42, name: 'material', colorScheme: 'teal-dark-compact', text: 'Teal Dark Compact', group: 'Material Design (Compact)',
  },
];

export default themes;
