import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface InputField {
    label: string;
    value: string;
}

const AddRemoveInputFields = ({ handleChange, options }) => {

    const [inputFields, setInputFields] = useState<InputField[]>([
        { label: "", value: "" },
    ]);

    useEffect(() => {
        if (options && inputFields?.length > 0 && inputFields[0].value === '') {
            console.log({ options })
            setInputFields(options)
        }
    }, [options]);

    useEffect(() => {
        handleChange('options', inputFields)
    }, [inputFields])

    const handleAddFields = () => {
        const newInputFields = [...inputFields];
        newInputFields.push({ label: "", value: "" });
        setInputFields(newInputFields);
    };

    const handleRemoveFields = (index: number) => {
        const newInputFields = [...inputFields];
        newInputFields.splice(index, 1);
        setInputFields(newInputFields);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newInputFields = [...inputFields];
        newInputFields[index].value = event.target.value;
        setInputFields(newInputFields);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
            {inputFields.map((inputField, index) => (
                <div key={index} style={{ margin: '5px' }}>
                    <TextField
                        label={`Option ${index + 1}`}
                        value={inputField.value}
                        onChange={(event: any) => handleInputChange(event, index)}
                    />

                    <Button sx={{ marginTop: 1, marginLeft: 3 }} startIcon={<DeleteIcon />} variant="text" color="error" onClick={() => handleRemoveFields(index)}>
                        Remove
                    </Button>
                </div>
            ))}

            <Button startIcon={<AddIcon />} variant="text" onClick={handleAddFields}>
                Add Option
            </Button>
        </div>
    );
};

export default AddRemoveInputFields;
