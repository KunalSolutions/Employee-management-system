import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/api/users/login",
        method: "POST",
        body: data,
      }),
    }),

    checkIn: builder.mutation({
      query: () => ({
        url: "/api/attendance/checkin",
        method: "POST",
      }),
    }),

    checkOut: builder.mutation({
      query: () => ({
        url: "/api/attendance/checkout",
        method: "PUT",
      }),
    }),

    getMyAttendance: builder.query({
      query: () => ({
        url: "/api/attendance/my",
      }),
    }),

    getAllAttendance: builder.query({
      query: () => ({
        url: "/api/attendance",
        method: "GET",
      }),
    }),

    // Employee CRUD
    createEmployee: builder.mutation({
      query: (data) => ({
        url: "/api/users",
        method: "POST",
        body: data,
      }),
    }),

    getEmployees: builder.query({
      query: () => ({
        url: "/api/users",
        method: "GET",
      }),
    }),

    getEmployeeById: builder.query({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "GET",
      }),
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/users/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    toggleEmployeeStatus: builder.mutation({
      query: (id) => ({
      url: `/api/users/${id}/toggle`,
      method: "PUT",
      }),
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
      }),
    }),
    getEmployeeAttendance: builder.query({
      query: (id) => `/api/attendance/employee/${id}`,
    }),

    // 🔥 Last 30 Days Attendance (Admin)
    getLast30DaysAttendance: builder.query({
      query: (id) => ({
        url: `/api/attendance/employee/${id}/last30`,
        method: "GET",
      }),
    }),

    // 🔥 Monthly Attendance (Admin)
    getMonthlyAttendance: builder.query({
      query: ({ id, year, month }) => ({
        url: `/api/attendance/employee/${id}/month?year=${year}&month=${month}`,
        method: "GET",
      }),
    }),

    generateSalary: builder.mutation({
  query: ({ id, ...data }) => ({
    url: `/salary/${id}`,
    method: "POST",
    body: data,
    responseHandler: (response) => response.blob(),
  }),
}),

getSalaryHistory: builder.query({
  query: (id) => `/salary/employee/${id}`,
  providesTags: ["Salary"],
}),

downloadSalarySlip: builder.mutation({
  query: (salaryId) => ({
    url: `/salary/download/${salaryId}`,
    method: "GET",
    responseHandler: (response) => response.blob(),
  }),
}),



  }),
});

export const {
  useLoginMutation,
  useCheckInMutation,
  useCheckOutMutation,
  useGetMyAttendanceQuery,
  useGetAllAttendanceQuery,
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useToggleEmployeeStatusMutation,
  useGetEmployeeAttendanceQuery,
  useGetLast30DaysAttendanceQuery,
  useGetMonthlyAttendanceQuery,
  useGenerateSalaryMutation,
  useGetSalaryHistoryQuery,
  useDownloadSalarySlipMutation,

} = apiSlice;
