import React, { useState } from 'react';
import { Modal, TextField, Button, Box } from "@mui/material";
import '@/Css/AddTicketModal.css';

interface AddTicketModalProps {
    open: boolean;  // To control modal visibility
    onClose: () => void; // Function to handle closing the modal
}

const AddTicketModal: React.FC<AddTicketModalProps> = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        cost: "",
        location: "",
        date: "",
        image: "",
    });


    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        // Save form logic
        console.log("Ticket data:", formData);
        onClose(); // Use onClose to close the modal
    };

    return (
        <div>
            {/* Modal for adding a new ticket */}
            <Modal open={open} onClose={onClose}>
                <Box className="modal-style">
                    <h2 >Add ticket</h2>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        margin="normal"
                        type="string"
                    />
                    <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        margin="normal"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        label="URL ảnh"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <Box className="button-group">
                        <Button onClick={onClose} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} variant="contained" color="primary">
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default AddTicketModal;
