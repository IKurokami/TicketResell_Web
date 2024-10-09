import React, { useState, useEffect } from "react";
import { Modal, TextField, Button, Box, Autocomplete, Typography } from "@mui/material";
import Cookies from "js-cookie";

interface UpdateTicketModalProps {
  open: boolean;
  onClose: () => void;
  ticketData: FormDataType; // Ticket data passed as prop
}

interface FormDataType {
  name: string;
  cost: string;
  location: string;
  date: string;
  image: string;
  description: string;
  Qrcode: string[];
  categories: Category[];
}

interface Category {
  categoryId: string;
  name: string;
}

const UpdateTicketModal: React.FC<UpdateTicketModalProps> = ({ open, onClose, ticketData }) => {
  const [formData, setFormData] = useState<FormDataType>(ticketData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(ticketData.image); // Pre-fill image preview
  const [qrFiles, setQrFiles] = useState<string[]>(ticketData.Qrcode);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5296/api/Category/read");
      const result = await response.json();

      if (Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        console.error("Expected array but got:", result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoriesChange = (event: React.SyntheticEvent<Element, Event>, value: Category[]) => {
    setFormData({
      ...formData,
      categories: value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setFormData((prevData) => ({
        ...prevData,
        image: file.name,
      }));

      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleQrFileChange = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const newQrFiles = [...qrFiles];
        newQrFiles[index] = reader.result as string;

        setQrFiles(newQrFiles);
        setFormData((prevData) => ({
          ...prevData,
          Qrcode: newQrFiles,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    const sellerId = Cookies.get("id");
    if (!formData.name || !formData.cost || !formData.location || !formData.date || !formData.image || !formData.description || !formData.Qrcode) {
      alert("Please fill in all required fields.");
      return;
    }

    const ticket = {
      TicketId: ticketData.TicketId, 
      SellerId: sellerId,
      Name: formData.name,
      Cost: parseFloat(formData.cost),
      Location: formData.location,
      StartDate: new Date(formData.date),
      Status: 1,
      Image: formData.image,
      Qrcode: formData.Qrcode,
      CategoriesId: formData.categories.map((category) => category.categoryId),
      Description: formData.description,
    };

    try {
      const response = await fetch(`http://localhost:5296/api/Ticket/update/${ticket.TicketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticket),
      });

      if (response.ok) {
        console.log("Ticket updated successfully.");
        onClose();
      } else {
        console.error("Failed to update the ticket.");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const handleCancel = () => {
    setFormData(ticketData);
    setSelectedFile(null);
    setImagePreview(ticketData.image); // Reset the image preview
    onClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            return;
          }
        }}
      >
        <Box className="modal-style">
          <div className="modal-content">
            <div className="modal-title">
              <h2>Update Ticket</h2>
              <button className="close-button" onClick={handleCancel}>
                ×
              </button>
            </div>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              margin="normal"
              type="string"
              required
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Date and Time"
              name="date"
              value={formData.date}
              onChange={handleChange}
              margin="normal"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <Autocomplete
              multiple
              options={categories}
              getOptionLabel={(option: Category) => option.name}
              value={formData.categories}
              onChange={handleCategoriesChange}
              renderInput={(params) => (
                <TextField {...params} label="Categories" margin="normal" />
              )}
              loading={loading}
              isOptionEqualToValue={(option, value) =>
                option.categoryId === value.categoryId
              }
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />

            <Typography variant="h6" margin="normal">
              Ticket Image:
            </Typography>
            <TextField
              fullWidth
              type="file"
              onChange={handleFileChange}
              margin="normal"
              inputProps={{ accept: "image/*" }}
              required
            />

            {imagePreview && (
              <Box className="image-preview">
                <img src={imagePreview} alt="Selected image preview" />
              </Box>
            )}

            {Array.from({ length: qrFiles.length }).map((_, index) => (
              <div key={index}>
                <Typography variant="h6" margin="normal">
                  QR image {index + 1}:
                </Typography>
                <TextField
                  fullWidth
                  type="file"
                  onChange={(event) => handleQrFileChange(index, event)}
                  margin="normal"
                  inputProps={{ accept: "image/*" }}
                  required
                />
                {qrFiles[index] && (
                  <Box className="qr-preview">
                    <img
                      src={qrFiles[index] as string}
                      alt={`QR Code ${index + 1}`}
                    />
                  </Box>
                )}
              </div>
            ))}

            <div className="button-container">
              <Button onClick={handleCancel} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleUpdate} color="primary" variant="contained">
                Update
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateTicketModal;
