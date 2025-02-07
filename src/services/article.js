import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const geminiApiKey = "AIzaSyCcEfLxskeNUABJC3RnJGWWhkrQ7R80bL0";

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.generativeai.google.com/v1beta2',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${geminiApiKey}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      queryFn: async (params, { signal }, extraOptions, fetchWithBQ) => {
        try {
          const result = await fetchWithBQ({
            url: '/models/gemini-flash:generateText', // Use gemini-flash
            method: 'POST',
            body: {
              prompt: {
                text: params.articleUrl,
              },
            },
            signal,
          });

          if (result.error) {
            return { error: result.error };
          }

          // Adapt the response (CRITICAL STEP)
          const summary = result.data?.candidates?.[0]?.output; // Safer access with optional chaining
          return { data: { summary } };

        } catch (error) {
          return { error: { status: error?.response?.status, data: error?.response?.data || error.message } };
        }
      },
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
