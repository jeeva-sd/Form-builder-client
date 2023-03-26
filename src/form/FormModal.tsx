import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { fieldDataTypes } from './types';

const schema = z.object({
    name: z.string().refine((name) => /^[a-z]/.test(name), {
        message: "Name must contain only small characters"
    }),
    type: z.object({
        label: z.string(),
        value: z.string()
    }).optional(),
    label: z.string(),
    required: z.boolean().optional()
});

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

const FormContent = ({ show, onHide, data, onAdd }) => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: (data) => {
            try {
                schema.parse(data);
                return { values: data, errors: {} };
            } catch (error) {
                return { values: {}, errors: error.formErrors };
            }
        }
    });

    const [modalData, setModalData] = React.useState<fieldDataTypes>({
        name: "",
        label: "",
        required: false,
        type: { label: "", value: "" },
    });

    React.useEffect(() => { if (data) setModalData(data) }, [data])
    const onSubmit = (data: any) => onAdd({ id: uuidv4(), ...modalData, ...data });

    const handleChange = (key: string, value: any) => {
        if (key === "type") {
            console.log(key, value)
            setModalData({
                ...modalData,
                type: { label: value, value },
            });
        } else {
            setModalData({
                ...modalData,
                [key]: value,
            });
        }
    };

    const { name, type, label, required } = modalData;
    const { fieldErrors } = errors;

    return (
        <div>
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack direction={'column'} spacing={3}>

                                <TextField
                                    {...register("name", { required: true })}
                                    error={!!errors.label}
                                    value={name}
                                    label="Field Name"
                                    required={true}
                                    onChange={(e: any) => handleChange("name", e.target.value)}
                                />

                                {fieldErrors && 'name' in fieldErrors && <span style={{ color: 'red' }}>{fieldErrors.name[0]}</span>}

                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Field Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={type?.value}
                                        label="Field Type"
                                        onChange={(e: any) => handleChange('type', e.target.value)}
                                    >
                                        <MenuItem value={'TEXT'}>Text</MenuItem>
                                        <MenuItem value={'TEXTAREA'}>TEXTAREA</MenuItem>
                                        <MenuItem value={'SELECT'}>SELECT</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    {...register('label', { required: true })}
                                    error={!!errors.label}
                                    value={label} label='Label'
                                    required={true}
                                    onChange={(e: any) => handleChange('label', e.target.value)} />
                                {errors.label && <span style={{ color: 'red' }}>This field is required</span>}

                                <FormControlLabel
                                    onChange={(e: any) => handleChange('required', e.target.checked)}
                                    control={<Checkbox checked={Boolean(required)} />}
                                    label="Required" />
                            </Stack>

                            <Button sx={{ width: '100%', mt: 4 }} type='submit' variant='contained' size="small">Save</Button>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
}

export default FormContent;
