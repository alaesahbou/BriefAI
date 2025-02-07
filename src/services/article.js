import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const articleApi = createApi({ // Keep the same name: articleApi
  reducerPath: 'articleApi', // Keep the same reducer path
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.generativeai.google.com/v1beta2', // Gemini API base URL
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${geminiApiKey}`); // Bearer token authentication
      headers.set('Content-Type', 'application/json'); // Important: Set content type
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({ // Keep the same endpoint name: getSummary
      queryFn: async (params, { signal }, extraOptions, fetchWithBQ) => {
          try {
            const result = await fetchWithBQ({
                url: '/models/gemini-pro:generateText',
                method: 'POST',
                body: {
                  prompt: {
                    text: params.articleUrl, // Use articleUrl as the prompt
                  },
                },
                signal // Pass the signal for cancellation
              });
              if (result.error) {
                return { error: result.error };
              }
              // Adapt Gemini's response to your original structure
              // The exact structure depends on Gemini's API response.
              // This is a placeholder; adjust it based on the actual response:
              const summary = result.data.candidates[0].output;  // Example; adjust as needed
              return { data: { summary } }; // Return data in the expected format
          } catch (error) {
            return { error: { status: error?.response?.status, data: error?.response?.data || error.message } }; // Handle errors
          }
      },
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi; // Keep the same export
