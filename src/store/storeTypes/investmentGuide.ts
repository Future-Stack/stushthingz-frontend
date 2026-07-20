// ─── Types matching the backend API response ──────────────────────────────────

export type TGuideItemType = 'text' | 'bullet' | 'note';
export type TGuideSectionType = 'accordion' | 'article' | 'warning' | 'checklist';

export interface TGuideItem {
  id: string;
  sectionId: string;
  title: string | null;
  content: string;
  type: TGuideItemType;
  sortOrder: number;
}

export interface TGuideSection {
  id: string;
  adminId: string;
  title: string;
  subtitle: string | null;
  icon: string | null;
  type: TGuideSectionType;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
  completedAt: string | null;
  items: TGuideItem[];
}

export interface TGuideResponse {
  success: boolean;
  message: string;
  data: TGuideSection[];
}

export interface TUpdateSectionDto {
  title?: string;
  subtitle?: string;
  content?: string;
}

export interface TUpdateSectionRequest {
  id: string;
  data: TUpdateSectionDto;
}
