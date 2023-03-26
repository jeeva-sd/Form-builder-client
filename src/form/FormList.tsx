import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Snackbar, Stack } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Loader from '../widgets/Loader';

export default function FormList() {
    const navigate = useNavigate();
    const [formList, setFormList] = useState<any[]>([]);
    const [snakBar, setSnakBar] = useState(false);
    const [isRequesting, setIsRequesting] = useState(true);

    const useStyles = makeStyles((theme: any) => createStyles({
        evenly: {
            display: 'flex',
            justifyContent: 'space-evenly',
        },
        myComponent: {
            padding: 5,
            [theme.breakpoints.up('xs')]: { margin: 10, maxWidth: 'auto', },
            [theme.breakpoints.up('sm')]: { maxWidth: 'auto', },
            [theme.breakpoints.up('md')]: { maxWidth: 300, minWidth: 350 },
            [theme.breakpoints.up('lg')]: { minWidth: 350, },
        },
        stack: {
            [theme.breakpoints.up('xs')]: { width: '80vw' },
            [theme.breakpoints.up('lg')]: { width: '90vw' },
            [theme.breakpoints.down('sm')]: {
                width: '85vw',
                flexDirection: 'column',
            },
            [theme.breakpoints.up('md')]: {
                flexWrap: 'wrap',
            },
        },
    }));

    const classes = useStyles();

    useEffect(() => {
        setIsRequesting(true)
        axios.get('http://localhost:4000/form')
            .then(response => { setFormList(response.data); setIsRequesting(false) })
            .catch(error => { console.log(error); setIsRequesting(false) });

        localStorage.setItem('page', 'home')
    }, []);

    const handleDelete = (formId: string) => {
        const updatedList = formList.filter((form: any) => form.formId === formId ? false : true);
        setFormList(updatedList);

        axios.delete(`http://localhost:4000/form/${formId}`)
            .then((_response) => {
                setSnakBar(true);
            })
            .catch(error => {
                setSnakBar(false);
                console.log(error);
            });
    }

    console.log({ formList })

    return (
        <Stack
            direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
            spacing={3}
            sx={{ margin: 5, justifyContent: 'center' }}
            className={classes.stack}
        >
            {formList.map((item: any, index: number) => {
                return (
                    <Card className={classes.myComponent} style={{ margin: 20 }} key={index}>
                        <CardContent>
                            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
                                {item.formName}
                            </Typography>
                            <Typography variant="h5" component="div">
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 1 }}>
                                Field count: {item.fields.length}
                            </Typography>
                            <Typography variant="body2">
                                Created on {moment(item.createdOn).format('DD MMM YYYY')}
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.evenly}>
                            <Button
                                onClick={() => navigate(`/${item.formId}`)}
                                size="small"
                                startIcon={<EditIcon />}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={() => handleDelete(item.formId)}
                                color="error"
                                size="small"
                                startIcon={<DeleteIcon />}
                            >
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                );
            })}

            {isRequesting && <Loader />}
            {formList.length === 0 && <span style={{ display: 'flex', alignItems: 'center' }}><AnnouncementIcon sx={{ marginRight: 1 }} /> No Form's Found</span>}

            <Snackbar
                open={snakBar}
                autoHideDuration={6000}
                onClose={() => setSnakBar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                message="Form Deleted Successfully"
            />
        </Stack>

    );
}
