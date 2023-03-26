import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import FormDetails from './FormDetails';
import FormList from './FormList';
import FormNameModal from './FormNameModal';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';



const Index = () => {
    const uuid = uuidv4();
    const navigate = useNavigate();
    const isHome = localStorage.getItem('page');
    const [showModal, setShowModal] = useState(false);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" variant='elevation'>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className='pointer' variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate('/')}>
                        Form Builder
                    </Typography>
                    {isHome === 'home' ? <Button color="inherit" onClick={() => setShowModal(true)}><AddIcon />New</Button> :
                        <Button color="inherit" onClick={() => navigate(`/`)}><ArrowBackIosIcon />Back</Button>}
                </Toolbar>
            </AppBar>

            <FormNameModal show={showModal} onHide={() => setShowModal(false)} handleForm={() => navigate(`/${uuid}`)} />

            <Routes>
                <Route path="/" element={<FormList />} />
                <Route path="/:id" element={<FormDetails />} />
            </Routes>
        </Box>
    );
}

export default Index;