import TopBar from '@/layouts/topbar/TopBar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ReactNode } from 'react';
import { useEffect } from 'react';
import { orderActions } from '@/features/complex/orderSlice'
import { useAppDispatch } from '@/core/redux/store';
import { fetchApiData } from '@/pages/complex/sync/DataLoad';

interface Props {
  children: ReactNode;
}

const MasterLayout = ({ children }: Props) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    fetchApiData.customers().then(data => {
      dispatch(orderActions.setCustomers(data.data))
    })
    fetchApiData.buyers().then(data => {
      dispatch(orderActions.setBuyers(data.data))
    })
    fetchApiData.products().then(data => {
      dispatch(orderActions.setProducts(data.data))
    })
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <TopBar />
      </AppBar>
      <Container
        maxWidth="xl"
        sx={{
          p: 3,
        }}
      >
        {children}
      </Container>
    </Box>
  );
}

export default MasterLayout;