import { baseAPI } from "./baseApi";
import { Property, WishlistProperty } from "../../types/property";

interface GetPropertiesArgs {
  page?: number;
  limit?: number;
  searchTerm?: string;
  type?: string;
}

interface PaginatedResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T;
}

interface BaseResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const propertyApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query<PaginatedResponse<Property[]>, GetPropertiesArgs>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args.page) params.append("page", args.page.toString());
        if (args.limit) params.append("limit", args.limit.toString());
        if (args.searchTerm) params.append("searchTerm", args.searchTerm);
        if (args.type) params.append("type", args.type);
        
        return {
          url: `/properties?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Property"],
    }),
    getPropertyById: builder.query<BaseResponse<Property>, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Property", id }],
    }),
    createProperty: builder.mutation<BaseResponse<Property>, FormData>({
      query: (data) => ({
        url: `/properties`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Property"],
    }),
    updateProperty: builder.mutation<BaseResponse<Property>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/properties/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Property",
        { type: "Property", id },
      ],
    }),
    deleteProperty: builder.mutation<BaseResponse<null>, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),
    toggleWishlist: builder.mutation<BaseResponse<null>, string>({
      query: (id) => ({
        url: `/properties/toggle-wishlist/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Property",
        "Wishlist",
        { type: "Property", id },
      ],
    }),
    getWishlistProperties: builder.query<BaseResponse<WishlistProperty[]>, void>({
      query: () => ({
        url: `/properties/wishlist`,
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useToggleWishlistMutation,
  useGetWishlistPropertiesQuery,
} = propertyApi;
