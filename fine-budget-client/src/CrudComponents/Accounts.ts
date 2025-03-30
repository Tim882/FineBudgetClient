// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   DataGrid,
//   GridColDef,
//   GridSortModel,
//   GridFilterModel,
//   GridPaginationModel,
//   GridToolbar,
//   GridActionsCellItem,
//   GridRowId,
//   GridRowModel,
// } from '@mui/x-data-grid';
// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Box,
//   IconButton,
//   Snackbar,
//   Alert,
//   AlertColor,
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Refresh as RefreshIcon,
// } from '@mui/icons-material';
// import { DefaultApi, ItemDto, PaginatedResult } from '../api';

// // Типы для пропсов и состояний
// interface SnackbarState {
//   open: boolean;
//   message: string;
//   severity: AlertColor;
// }

// type CrudOperation = 'create' | 'update' | 'delete';

// const api = new DefaultApi();

// const CrudTable: React.FC = () => {
//   // Состояние таблицы
//   const [rows, setRows] = useState<ItemDto[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [totalCount, setTotalCount] = useState<number>(0);
//   const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
//     page: 0,
//     pageSize: 10,
//   });
//   const [sortModel, setSortModel] = useState<GridSortModel>([]);
//   const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });

//   // Состояние для CRUD операций
//   const [openDialog, setOpenDialog] = useState<boolean>(false);
//   const [currentItem, setCurrentItem] = useState<ItemDto | null>(null);
//   const [operationType, setOperationType] = useState<CrudOperation>('create');
//   const [snackbar, setSnackbar] = useState<SnackbarState>({
//     open: false,
//     message: '',
//     severity: 'success',
//   });

//   // Загрузка данных с сервера
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const { page, pageSize } = paginationModel;
//       const sortBy = sortModel[0]?.field;
//       const sortDescending = sortModel[0]?.sort === 'desc';
//       const filterItem = filterModel.items[0];
//       const filter = filterItem?.field;
//       const filterValue = filterItem?.value;

//       const response = await api.getItems(
//         page + 1,
//         pageSize,
//         filter,
//         filterValue,
//         sortBy,
//         sortDescending
//       );

//       setRows(response.data.items || []);
//       setTotalCount(response.data.totalCount || 0);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       showSnackbar('Failed to fetch data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [paginationModel, sortModel, filterModel]);

//   // Эффект для загрузки данных
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Вспомогательная функция для уведомлений
//   const showSnackbar = (message: string, severity: AlertColor) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   // Обработчики CRUD операций
//   const handleOperation = useCallback(
//     async (item: ItemDto | Omit<ItemDto, 'id'>, operation: CrudOperation) => {
//       try {
//         switch (operation) {
//           case 'create':
//             await api.createItem(item);
//             showSnackbar('Item created successfully', 'success');
//             break;
//           case 'update':
//             if ('id' in item) {
//               await api.updateItem(item.id, item);
//               showSnackbar('Item updated successfully', 'success');
//             }
//             break;
//           case 'delete':
//             if ('id' in item) {
//               await api.deleteItem(item.id);
//               showSnackbar('Item deleted successfully', 'success');
//             }
//             break;
//         }
//         fetchData();
//       } catch (error) {
//         const operationText = operation === 'create' ? 'create' : 
//                            operation === 'update' ? 'update' : 'delete';
//         showSnackbar(`Failed to ${operationText} item`, 'error');
//       }
//     },
//     [fetchData]
//   );

//   // Обработчики UI событий
//   const handleAddClick = () => {
//     setCurrentItem({ name: '', description: '' } as Omit<ItemDto, 'id'>);
//     setOperationType('create');
//     setOpenDialog(true);
//   };

//   const handleEditClick = (item: ItemDto) => {
//     setCurrentItem(item);
//     setOperationType('update');
//     setOpenDialog(true);
//   };

//   const handleDeleteClick = (id: GridRowId) => {
//     if (window.confirm('Are you sure you want to delete this item?')) {
//       handleOperation({ id: id.toString() } as ItemDto, 'delete');
//     }
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//     setCurrentItem(null);
//   };

//   const handleDialogSubmit = () => {
//     if (currentItem) {
//       handleOperation(currentItem, operationType);
//     }
//     handleDialogClose();
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (currentItem) {
//       setCurrentItem({
//         ...currentItem,
//         [e.target.name]: e.target.value,
//       } as ItemDto);
//     }
//   };

//   // Определение колонок таблицы
//   const columns: GridColDef<ItemDto>[] = [
//     { 
//       field: 'id', 
//       headerName: 'ID', 
//       width: 200,
//       type: 'string',
//     },
//     { 
//       field: 'name', 
//       headerName: 'Name', 
//       width: 200, 
//       editable: false,
//       type: 'string',
//     },
//     { 
//       field: 'description', 
//       headerName: 'Description', 
//       width: 300, 
//       editable: false,
//       type: 'string',
//     },
//     {
//       field: 'actions',
//       type: 'actions',
//       headerName: 'Actions',
//       width: 150,
//       getActions: (params: { row: ItemDto, id: GridRowId }) => [
//         <GridActionsCellItem
//           key="edit"
//           icon={<EditIcon />}
//           label="Edit"
//           onClick={() => handleEditClick(params.row)}
//           showInMenu
//         />,
//         <GridActionsCellItem
//           key="delete"
//           icon={<DeleteIcon />}
//           label="Delete"
//           onClick={() => handleDeleteClick(params.id)}
//           showInMenu
//         />,
//       ],
//     },
//   ];

//   return (
//     <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleAddClick}
//           sx={{ mb: 2 }}
//         >
//           Add Item
//         </Button>
//         <IconButton onClick={fetchData} aria-label="refresh">
//           <RefreshIcon />
//         </IconButton>
//       </Box>

//       <DataGrid
//         rows={rows}
//         columns={columns}
//         loading={loading}
//         rowCount={totalCount}
//         paginationMode="server"
//         sortingMode="server"
//         filterMode="server"
//         paginationModel={paginationModel}
//         onPaginationModelChange={setPaginationModel}
//         sortModel={sortModel}
//         onSortModelChange={setSortModel}
//         filterModel={filterModel}
//         onFilterModelChange={setFilterModel}
//         pageSizeOptions={[5, 10, 20, 50]}
//         disableColumnMenu={false}
//         slots={{
//           toolbar: GridToolbar,
//         }}
//         slotProps={{
//           toolbar: {
//             showQuickFilter: true,
//             printOptions: { disableToolbarButton: true },
//             csvOptions: { disableToolbarButton: true },
//           },
//         }}
//         sx={{
//           '& .MuiDataGrid-cell': {
//             outline: 'none !important',
//           },
//         }}
//       />

//       {/* Диалог для создания/редактирования */}
//       <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
//         <DialogTitle>{operationType === 'create' ? 'Add Item' : 'Edit Item'}</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             name="name"
//             label="Name"
//             type="text"
//             fullWidth
//             variant="standard"
//             value={currentItem?.name || ''}
//             onChange={handleInputChange}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             margin="dense"
//             name="description"
//             label="Description"
//             type="text"
//             fullWidth
//             variant="standard"
//             value={currentItem?.description || ''}
//             onChange={handleInputChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose}>Cancel</Button>
//           <Button 
//             onClick={handleDialogSubmit}
//             variant="contained"
//             disabled={!currentItem?.name || !currentItem?.description}
//           >
//             {operationType === 'create' ? 'Create' : 'Update'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Уведомления */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default CrudTable;