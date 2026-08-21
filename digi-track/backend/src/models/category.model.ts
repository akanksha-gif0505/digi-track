export interface CategoryModel {
  id: string;
  userId?: string | null; // null for system defaults
  name: string;
  icon: string;
  bgClass: string;
  iconColorClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  colorHex: string;
  defaultCap: number;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}
