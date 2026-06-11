import { OccasionCategory } from './types'

export const OCCASIONS: OccasionCategory[] = [
  { slug: 'birthday-kids', label: "Kids Birthday", emoji: '🎂', description: "Colorful birthday invitations for children", heroColor: '#F59E0B' },
  { slug: 'birthday-adult', label: "Birthday", emoji: '🎉', description: "Elegant birthday party invitations", heroColor: '#4F46E5' },
  { slug: 'birthday-milestone', label: "Milestone Birthday", emoji: '🥳', description: "Special 18th, 30th, 50th birthday invitations", heroColor: '#7C3AED' },
  { slug: 'wedding', label: "Wedding", emoji: '💍', description: "Timeless wedding invitations", heroColor: '#E11D48' },
  { slug: 'engagement', label: "Engagement", emoji: '💑', description: "Beautiful engagement ceremony invitations", heroColor: '#EC4899' },
  { slug: 'mehendi', label: "Mehendi", emoji: '🌿', description: "Traditional mehendi ceremony invitations", heroColor: '#059669' },
  { slug: 'sangeet', label: "Sangeet", emoji: '🎵', description: "Vibrant sangeet night invitations", heroColor: '#8B5CF6' },
  { slug: 'baby-shower', label: "Baby Shower", emoji: '👶', description: "Sweet baby shower invitations", heroColor: '#06B6D4' },
  { slug: 'naming-ceremony', label: "Naming Ceremony", emoji: '🌸', description: "Naamkaran and naming ceremony invitations", heroColor: '#F472B6' },
  { slug: 'diwali', label: "Diwali", emoji: '🪔', description: "Festive Diwali celebration invitations", heroColor: '#F59E0B' },
  { slug: 'ganesh-chaturthi', label: "Ganesh Chaturthi", emoji: '🐘', description: "Ganesh Chaturthi pooja invitations", heroColor: '#F97316' },
  { slug: 'holi', label: "Holi", emoji: '🌈', description: "Colorful Holi celebration invitations", heroColor: '#10B981' },
  { slug: 'eid', label: "Eid", emoji: '🌙', description: "Beautiful Eid Mubarak invitations", heroColor: '#059669' },
  { slug: 'christmas', label: "Christmas", emoji: '🎄', description: "Festive Christmas party invitations", heroColor: '#DC2626' },
  { slug: 'office-party', label: "Office Party", emoji: '🏢', description: "Professional office event invitations", heroColor: '#1D4ED8' },
  { slug: 'farewell', label: "Farewell", emoji: '👋', description: "Heartfelt farewell party invitations", heroColor: '#7C3AED' },
  { slug: 'promotion', label: "Promotion Celebration", emoji: '🎊', description: "Celebrate promotions and achievements", heroColor: '#F59E0B' },
  { slug: 'dinner-party', label: "Dinner Party", emoji: '🍽️', description: "Elegant dinner party invitations", heroColor: '#1F2937' },
  { slug: 'lunch-party', label: "Lunch Party", emoji: '🥗', description: "Casual lunch gathering invitations", heroColor: '#065F46' },
  { slug: 'brunch', label: "Brunch", emoji: '☕', description: "Stylish brunch invitations", heroColor: '#92400E' },
  { slug: 'cocktail-party', label: "Cocktail Party", emoji: '🍹', description: "Sophisticated cocktail party invitations", heroColor: '#4F46E5' },
  { slug: 'graduation', label: "Graduation", emoji: '🎓', description: "Proud graduation ceremony invitations", heroColor: '#1D4ED8' },
  { slug: 'anniversary', label: "Anniversary", emoji: '💝', description: "Romantic wedding anniversary invitations", heroColor: '#E11D48' },
  { slug: 'retirement', label: "Retirement", emoji: '🏖️', description: "Celebratory retirement party invitations", heroColor: '#F59E0B' },
  { slug: 'housewarming', label: "Housewarming", emoji: '🏠', description: "Griha Pravesh and housewarming invitations", heroColor: '#059669' },
  { slug: 'pool-party', label: "Pool Party", emoji: '🏊', description: "Fun summer pool party invitations", heroColor: '#0EA5E9' },
  { slug: 'new-year', label: "New Year", emoji: '🎆', description: "Spectacular New Year celebration invitations", heroColor: '#1D4ED8' },
  { slug: 'valentines-day', label: "Valentine's Day", emoji: '❤️', description: "Romantic Valentine's Day invitations", heroColor: '#E11D48' },
]

export const FEATURED_OCCASIONS = OCCASIONS.slice(0, 10)

export function getOccasion(slug: string): OccasionCategory | undefined {
  return OCCASIONS.find(o => o.slug === slug)
}
