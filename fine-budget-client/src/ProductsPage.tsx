import React from 'react';
import AdvancedTablePage from './AdvancedTablePage';
import { useNavigate } from 'react-router-dom';
import { AccountResponseDto, AccountsApi, Configuration } from './api';
import { Box } from '@mui/material';

const config = new Configuration({ basePath: "https://localhost:7230" });

let client = new AccountsApi(config);

interface Product {
  id: string;
  title: string;
  balance: number;
}

const ProductsPage = () => {
  const navigate = useNavigate();

  // Properly typed fetch function
  const fetchProducts = async (
    pagination: { page: number; pageSize: number },
    sort: { field: string; direction: 'asc' | 'desc' } | null,
    filters: Record<string, string>
  ): Promise<{ data: Product[]; totalCount: number }> => {
    // Build query params
    const params = new URLSearchParams();
    params.append('page', (pagination.page + 1).toString());
    params.append('pageSize', pagination.pageSize.toString());
    
    if (sort) {
      params.append('sortField', sort.field);
      params.append('sortDirection', sort.direction);
    }
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    try {
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return { data: [], totalCount: 0 };
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
    } catch (error) {
      console.error('Delete error:', error);
      throw error; // Re-throw to let the table handle the error
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <AdvancedTablePage<AccountResponseDto>
        title="Товары"
        columns={[
          { 
            field: 'id', 
            headerName: 'ID', 
            width: 80, 
            sortable: true,
            filterable: true,
            filterType: 'operator', // Изменили на 'operator'
            supportedOperators: ['eq', 'contains'],
          },
          { 
            field: 'title', 
            headerName: 'Название', 
            sortable: true, 
            filterable: true,
            filterType: 'operator', // Изменили на 'operator'
            supportedOperators: ['eq', 'contains'],
          },
          // { 
          //   field: 'category', 
          //   headerName: 'Категория', 
          //   sortable: true, 
          //   filterable: true,
          //   filterType: 'select', // Оставляем как есть для простых селектов
          //   filterOptions: [
          //     { value: 'electronics', label: 'Электроника' },
          //     { value: 'clothing', label: 'Одежда' },
          //     { value: 'food', label: 'Продукты' }
          //   ]
          // },
          { 
            field: 'balance', 
            headerName: 'Баланс', 
            sortable: true,
            filterable: true,
            filterType: 'operator', // Изменили на 'operator'
            supportedOperators: ['eq', 'gt', 'gte', 'lt', 'lte', 'between'],
            renderCell: (value) => `$${value.toFixed(2)}`,
          },
        ]}
        fetchData={async (pagination, sort, filters) => {
          // filters будет в формате: { "price_gte": "100", "price_lte": "500" }
          const response = await client.apiAccountsGet(pagination.page, pagination.pageSize, sort?.field, sort?.direction === 'asc', filters);
          console.log(response);

          return {
            data: response.data.data?.data ?? [],
            totalCount: response.data.data?.totalCount ?? 0
          };
        }}
        onAdd={() => navigate('/products/new')}
        onEdit={(product) => navigate(`/products/edit/${product.id}`)}
        onDelete={handleDelete}
        initialPageSize={10}
      />
    </Box>
    
  );
};

export default ProductsPage;