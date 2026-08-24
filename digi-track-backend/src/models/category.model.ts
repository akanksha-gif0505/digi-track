export interface CategoryModel {
  id: string;
  userId?: string | null;
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
