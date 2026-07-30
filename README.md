# Sales Analytics Dashboard

## Overview

The Sales Analytics Dashboard is a responsive web application built using React, TypeScript, and Vite. It provides sales insights through KPI cards and a sales data table with search, filtering, sorting, pagination, and CSV export functionality.

The application is designed with a modular architecture to ensure scalability, maintainability, and code reusability.

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query (React Query)
- Axios
- Material UI

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd sales-analytics-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Folder Structure

```
src/
├── components/
├── pages/
├── hooks/
├── services/
├── types/
├── utils/
├── constants/
├── context/
└── assets/
```

---

## Features

### Dashboard Summary

Displays the following KPIs:

- Total Sales
- Total Orders
- Total Customers
- Average Order Value

### Sales Table

Displays:

- Order ID
- Customer Name
- Product Name
- Category
- Quantity
- Amount
- Order Date
- Order Status

### Search

Supports searching by:

- Order ID
- Customer Name
- Product Name

### Filters

- Date Range
- Order Status
- Product Category

Multiple filters can be applied simultaneously.

### Sorting

Sorting is available for:

- Order Date
- Amount
- Quantity

Both ascending and descending order are supported.

### Pagination

Server-side pagination is implemented for efficient data loading.

### CSV Export

Exports the currently filtered sales records to a CSV file.

### Loading State

Displays loading indicators while fetching data.

### Empty State

Displays a user-friendly message when no records are found.

### Error Handling

Handles:

- API errors
- Network failures
- Invalid responses

Users can retry failed requests.

---

## API Endpoints

Dashboard Summary

```
GET /api/dashboard/summary
```

Sales List

```
GET /api/sales
```

Supported Query Parameters

```
page
limit
search
status
category
sortBy
sortOrder
startDate
endDate
```

---

## Project Design

The application follows a component-based architecture.

- Components are reusable and independent.
- API calls are managed through Axios.
- Server state is handled using TanStack Query.
- TypeScript interfaces are used for type safety.
- The project is organized to support future enhancements and easier maintenance.

---

## Assumptions

- API response format follows the specification provided in the assignment.
- Currency formatting uses INR.
- Authentication is outside the scope of this assignment.

---

## Future Enhancements

- Debounced Search
- Column Visibility Toggle
- Filter Persistence using Local Storage
- Skeleton Loaders
- Retry Functionality
- Unit Testing

---

## Author

**Aswin Mon M**

React Frontend Developer