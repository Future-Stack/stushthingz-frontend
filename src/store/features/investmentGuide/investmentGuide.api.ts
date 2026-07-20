import { baseAPI } from '@/store/api/baseApi';
import type {
  TGuideResponse,
  TUpdateSectionRequest,
} from '@/store/storeTypes/investmentGuide';

export const investmentGuideAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    // GET /investment-guide — user: fetch all sections with isCompleted per user
    getInvestmentGuide: build.query<TGuideResponse, void>({
      query: () => ({
        url: '/investment-guide',
        method: 'GET',
      }),
      providesTags: ['InvestmentGuide'],
    }),

    // POST /investment-guide/:id/read — user: mark section as read
    markSectionAsRead: build.mutation<{ success: boolean; message: string }, string>({
      query: (sectionId) => ({
        url: `/investment-guide/${sectionId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['InvestmentGuide'],
    }),

    // PATCH /investment-guide/:id — admin: update section content
    updateGuideSection: build.mutation<{ success: boolean; message: string }, TUpdateSectionRequest>({
      query: ({ id, data }) => ({
        url: `/investment-guide/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['InvestmentGuide'],
    }),

    // DELETE /investment-guide/:id — admin: delete section
    deleteGuideSection: build.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/investment-guide/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InvestmentGuide'],
    }),
  }),
});

export const {
  useGetInvestmentGuideQuery,
  useMarkSectionAsReadMutation,
  useUpdateGuideSectionMutation,
  useDeleteGuideSectionMutation,
} = investmentGuideAPI;
