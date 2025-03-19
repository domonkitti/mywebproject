// CompanyList1.test.tsx


import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CompanyList1 from '../components/CompanyClass';
import { getClasss } from '../apis/CompanyClass';
import { describe, test, expect ,vi } from 'vitest';

// Mock the getClasss function
vi.mock('../apis/CompanyClass', () => ({
  getClasss: vi.fn(),
}));

const mockData = {
  companyFullName: 'Test Company',
  companyClasses: [
    { courseName: 'React Basics', totalClasses: 5, totalParticipants: 20 },
    { courseName: 'Advanced TypeScript', totalClasses: 3, totalParticipants: 15 },
  ],
};

describe('CompanyList1 Component', () => {
  beforeEach(() => {
    (getClasss as jest.Mock).mockResolvedValue(mockData);
  });

  test('renders company name and courses', async () => {
    render(
      <BrowserRouter>
        <CompanyList1 />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();
    });
  });

  test('filters courses based on search input', async () => {
    render(
      <BrowserRouter>
        <CompanyList1 />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('React Basics'));

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'TypeScript' } });

    await waitFor(() => {
      expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();
      expect(screen.queryByText('React Basics')).not.toBeInTheDocument();
    });
  });

  test('shows "No Data Found!" when no courses match the search', async () => {
    render(
      <BrowserRouter>
        <CompanyList1 />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('React Basics'));

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Course' } });

    await waitFor(() => {
      expect(screen.getByText('No Data Found!')).toBeInTheDocument();
    });
  });
});