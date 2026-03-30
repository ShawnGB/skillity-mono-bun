import { WorkshopCategory } from '@skillity/shared';

interface CategoryStyle {
  gradient: string;
  label: string;
}

const CATEGORY_STYLES: Record<WorkshopCategory, CategoryStyle> = {
  [WorkshopCategory.CRAFTS_AND_MAKING]: {
    gradient: 'from-amber-800 to-orange-600',
    label: 'Crafts & Making',
  },
  [WorkshopCategory.COOKING_AND_FOOD]: {
    gradient: 'from-red-700 to-orange-500',
    label: 'Cooking & Food',
  },
  [WorkshopCategory.MUSIC_AND_SOUND]: {
    gradient: 'from-violet-700 to-purple-500',
    label: 'Music & Sound',
  },
  [WorkshopCategory.VISUAL_ARTS]: {
    gradient: 'from-blue-700 to-cyan-500',
    label: 'Visual Arts',
  },
  [WorkshopCategory.WRITING]: {
    gradient: 'from-slate-700 to-gray-500',
    label: 'Writing',
  },
  [WorkshopCategory.DIGITAL_SKILLS]: {
    gradient: 'from-teal-700 to-emerald-500',
    label: 'Digital Skills',
  },
  [WorkshopCategory.MOVEMENT_AND_BODY]: {
    gradient: 'from-green-700 to-lime-500',
    label: 'Movement & Body',
  },
  [WorkshopCategory.LANGUAGES]: {
    gradient: 'from-yellow-700 to-amber-500',
    label: 'Languages',
  },
  [WorkshopCategory.SCIENCE_AND_NATURE]: {
    gradient: 'from-emerald-800 to-green-600',
    label: 'Science & Nature',
  },
  [WorkshopCategory.BUSINESS_AND_ENTREPRENEURSHIP]: {
    gradient: 'from-zinc-700 to-stone-500',
    label: 'Business',
  },
};

export function getCategoryStyle(category: WorkshopCategory): CategoryStyle {
  return CATEGORY_STYLES[category] ?? { gradient: 'from-stone-700 to-stone-500', label: '' };
}
