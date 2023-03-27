import { useParams } from 'react-router';
import React, { useEffect } from 'react';
import axios from 'axios';
import FormModal from './FormModal';
import Loader from '../widgets/Loader';

import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { fieldDataTypes } from './types';
import Skeleton from '@mui/material/Skeleton';
import { Container } from '@mui/system';
import Snackbar from '@mui/material/Snackbar';
import { config } from '../config/config';

const FormDetails = () => {
    const { id } = useParams();

    const formObj = {
        formName: localStorage.getItem('formName'),
        formId: id,
        fields: [],
    };

    const [fields, setFields] = React.useState(formObj);
    const [snakBar, setSnakBar] = React.useState(false);
    const [isRequesting, setIsRequesting] = React.useState(true);
    const [modalData, setModalData] = React.useState({});
    const [showModal, setShowModal] = React.useState<boolean>(false);

    const Item = styled(Box)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        display: 'flex',
        justifyContent: 'center',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const addFieldObj: fieldDataTypes = {
        name: '',
        label: '',
        required: false,
        type: { label: 'TEXT', value: 'TEXT' }
    };

    useEffect(() => {
        setIsRequesting(true)
        axios.get(`${config.apiUrl}/form/${id}`)
            .then(response => {
                setIsRequesting(false)
                if (typeof response.data === 'string') setFields(formObj)
                else setFields(response.data);

            })
            .catch(error => {
                setIsRequesting(false)
                console.log(error)
            });

        localStorage.setItem('page', 'form');
    }, []);

    const handleClose = () => setShowModal(false);

    const onAdd = (data: any) => {
        setShowModal(false);
        const type = localStorage.getItem('type')

        if (type === 'add') {
            const form = { ...fields, fields: [...fields.fields, data] }
            setFields(prevFields => ({ ...prevFields, fields: [...prevFields.fields, data] }));
            handleAdd(form);
        } else {
            const form = { ...fields, fields: fields.fields.map((e: any) => data.id === e.id ? data : e) }

            setFields(prevFields => ({ ...prevFields, fields: prevFields.fields.map((e: any) => data.id === e.id ? data : e) }));
            handleEdit(form)
        }
    };

    const handleAdd = (data: any) => {
        axios.post(`${config.apiUrl}/form`, data)
            .then(response => {
                if (typeof response.data !== 'string') setSnakBar(true)
            })
            .catch(error => {
                setIsRequesting(false)
                console.log(error)
            });
    }

    const handleEdit = (data: any) => {
        axios.patch(`${config.apiUrl}/form/${data.formId}`, data)
            .then(response => {
                if (typeof response.data !== 'string') setSnakBar(true)
            })
            .catch(error => {
                setIsRequesting(false)
                console.log(error)
            });
    }

    const handleDelete = (id: string) => {
        setFields(prevFields => ({ ...prevFields, fields: prevFields.fields.filter((e: any) => id === e.id ? false : true) }));
        handleEdit({ ...fields, fields: fields.fields.filter((e: any) => id === e.id ? false : true) })
    };

    useEffect(() => {
        if (snakBar) {
            setTimeout(() => {
                setSnakBar(false)
            }, 3000)
        }
    }, [snakBar]);

    return (
        <>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Grid item lg={7} md={6} sm={10} xs={10} style={{ border: '1px solid grey', borderRadius: 2, padding: 0 }}>
                    <Item style={{ borderBottom: '1px solid grey', borderRadius: 2, justifyContent: 'space-between', padding: 15, backgroundColor: '#ececece3' }}>
                        <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
                            {fields?.formName ? `${fields?.formName.charAt(0).toUpperCase() + fields?.formName.slice(1)} From` : 'Fields'}
                        </Typography>

                        <Button onClick={() => { setShowModal(true); setModalData(addFieldObj); localStorage.setItem('type', 'add') }} size="small" startIcon={<AddIcon />}>Add</Button>
                    </Item>
                    <Item>
                        {isRequesting && (
                            <Container>
                                <Skeleton style={{ margin: 5 }} width={350} variant="rectangular" />
                                <Skeleton style={{ margin: 5 }} width={'100%'} variant="rectangular" />
                                <Skeleton style={{ margin: 5 }} width={'100%'} variant="rectangular" />
                                <Skeleton style={{ margin: 5 }} width={'100%'} variant="rectangular" />
                            </Container>
                        )}

                        <List sx={{ width: '100%', maxWidth: 500 }}>
                            {!isRequesting && fields && fields?.fields.map((field: any, index: number) => {
                                const labelId = `checkbox-list-label-${field.name}`;

                                return (
                                    <React.Fragment key={index}>
                                        <ListItem
                                            sx={{ width: '100%' }}
                                            secondaryAction={
                                                <>
                                                    <IconButton edge="end" aria-label="edit" onClick={() => { setShowModal(true); setModalData(field); localStorage.setItem('type', 'edit') }}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(field.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            }
                                            disablePadding
                                        >
                                            <ListItemButton role={undefined} dense>
                                                <span style={{ marginRight: 5 }}>{`${index + 1}. `}</span> {' '}<ListItemText id={labelId} primary={field.name} />
                                            </ListItemButton>
                                        </ListItem>
                                        {index !== fields.fields.length - 1 && <Divider />}
                                    </React.Fragment>
                                );
                            })}

                            {!isRequesting && fields && fields.fields.length === 0 && <span>No Fields Found</span>}
                        </List>

                    </Item >
                </Grid >

                {isRequesting && <Loader />}
            </Grid >

            <Snackbar
                open={snakBar}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                message="Form Updated Successfully"
            />

            <FormModal show={showModal} onHide={handleClose} data={modalData} onAdd={onAdd} />
        </>
    );
}

export default React.memo(FormDetails);