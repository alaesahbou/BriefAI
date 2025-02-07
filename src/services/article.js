import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY; // Use environment variable or hardcoded key (NOT RECOMMENDED for production)

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta', // Updated base URL
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json'); // Content type is essential
      return headers; // No need to set the key in headers for this API
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      queryFn: async (params, { signal }, extraOptions, fetchWithBQ) => {
        try {
          const result = await fetchWithBQ({
            url: `/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, // Key as query parameter
            method: 'POST',
            body: {
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: params.articleUrl, // Use articleUrl as input
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 1,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain", // Important: Request plain text
              },
            },
            signal,
          });

          if (result.error) {
            return { error: result.error };
          }

          // Adapt the response (CRITICAL STEP)
          const summary = result.data?.candidates?.[0]?.content; // Correct path for Gemini 1.5-flash

          return { data: { summary } };

        } catch (error) {
          return { error: { status: error?.response?.status, data: error?.response?.data || error.message } };
        }
      },
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
