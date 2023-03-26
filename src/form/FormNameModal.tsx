import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import { Box, Button, Fade, FormControl, TextField, Typography } from '@mui/material';

const FormNameModal = ({ show, onHide, handleForm }) => {
    const [formName, setFormName] = useState('');

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 1,
        p: 4,
    };

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={show}
            onClose={onHide}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={show}>
                <Box sx={style}>
                    <form onSubmit={() => { localStorage.setItem('formName', formName); handleForm() }}>
                        <FormControl fullWidth>
                            <TextField
                                value={formName}
                                label="Form Name"
                                required={true}
                                onChange={(e: any) => setFormName(e.target.value)}
                            />
                        </FormControl>

                        <Button sx={{ width: '100%', mt: 4 }} type='submit' variant='contained' size="small">Continue</Button>
                    </form>

                </Box>
            </Fade>
        </Modal>
    )
}

export default FormNameModal