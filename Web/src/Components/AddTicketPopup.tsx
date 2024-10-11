import React, { useState, useEffect } from "react";

import { fetchTicketItems } from "@/models/TicketSellCard";
import {
  Modal,
  TextField,
  Button,
  Box,
  Autocomplete,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie"; 
import "@/Css/AddTicketModal.css";

interface AddTicketModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormDataType {
  name: string;
  cost: string;
  location: string;
  date: string;
  image: string;
  description: string;
  Qrcode: string[]; // Change this to an array of files
  categories: Category[];
}

interface Category {
  categoryId: string;
  name: string;
}

const AddTicketModal: React.FC<AddTicketModalProps> = ({ open, onClose }) => {
  const initialFormData: FormDataType = {
    name: "",
    cost: "",
    location: "",
    date: "",
    image: "",
    description: "",
    Qrcode: [],
    categories: [],
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Add state for image preview
  const [quantity, setQuantity] = useState(1);
  const [qrFileNames, setQrFileNames] = useState(Array(quantity).fill(""));
  const [qrFiles, setQrFiles] = useState(Array(quantity).fill(null));

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

  const handleCategoriesChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Category[]
  ) => {
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

  const handleQrFileChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const newQrFiles = [...qrFiles];
        const newQrFileNames = [...qrFileNames];

        newQrFiles[index] = reader.result as string;
        newQrFileNames[index] = file.name;

        setQrFiles(newQrFiles);
        setQrFileNames(newQrFileNames);

        setFormData((prevData) => ({
          ...prevData,
          qr: newQrFiles,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);

    setQrFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      while (updatedFiles.length < newQuantity) {
        updatedFiles.push(null);
      }
      return updatedFiles.slice(0, newQuantity);
    });

    setQrFileNames((prevNames) => {
      const updatedNames = [...prevNames];
      while (updatedNames.length < newQuantity) {
        updatedNames.push("");
      }
      return updatedNames.slice(0, newQuantity);
    });
  };

  const handleSave = async () => {
    const sellerId = Cookies.get("id");
    if (
      !formData.name ||
      !formData.cost ||
      !formData.location ||
      !formData.date ||
      !formData.image ||
      !formData.description ||
      !formData.Qrcode
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const generateTicketId = () => {
      const randomNum = Math.floor(100 + Math.random() * 900);
      return `TICKET${randomNum}`;
    };

    const checkTicketIdExist = async (ticketId: string) => {
      const response = await fetch(
        `http://localhost:5296/api/Ticket/checkexist/${ticketId}`
      );
      return response.status === 200;
    };

    const createTickets = async () => {
      let baseTicketId = generateTicketId();
      let isValidId = await checkTicketIdExist(baseTicketId);

      while (isValidId) {
        baseTicketId = generateTicketId();
        isValidId = await checkTicketIdExist(baseTicketId);
      }

      const tickets = Array.from({ length: quantity }).map((_, index) => {
        let ticketId = baseTicketId;
        if (quantity > 1) {
          ticketId = `${baseTicketId}_${index + 1}`;
        }

        return {
          TicketId: ticketId,
          SellerId: sellerId,
          Name: formData.name,
          Cost: parseFloat(formData.cost),
          Location: formData.location,
          StartDate: new Date(formData.date),
          Status: 1,
          Image: baseTicketId,
          Qrcode: qrFiles[index],
          CategoriesId: formData.categories.map(
            (category) => category.categoryId
          ),
          Description: formData.description,
        };
      });

      console.log(tickets);

      const uploadImagePromises = tickets.map((ticket) => {
        const formData = new FormData();
        formData.append("id", ticket.Image);
        formData.append("image", selectedFile as Blob);
        return fetch("/api/uploadImage", {
          method: "POST",
          body: formData,
        });
      });

      try {
        await Promise.all(uploadImagePromises);
        console.log("Images uploaded successfully (simulated).");

        const createTicketPromises = tickets.map(async (ticket) => {
          await fetch("http://localhost:5296/api/Ticket/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ticket),
          });
        });

        await Promise.all(createTicketPromises);
        console.log("Tickets created successfully.");
      } catch (error) {
        console.error("Error creating tickets or uploading images:", error);
      }
      setFormData(initialFormData);
      setSelectedFile(null);
      setQrFiles([]);
      setQuantity(1);
      setQrFileNames([]);
      setImagePreview(null);
      onClose();
    };

    await createTickets();
    fetchTicketItems(); 
  };



  const handleCancel = () => {
    setFormData(initialFormData);
    setSelectedFile(null);
    setQrFiles([]);
    setQuantity(1);
    setQrFileNames([]);
    setImagePreview(null); // Clear the image preview
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
              <h2>Add Ticket</h2>
              <button className="close-button" onClick={handleCancel}>
                ×
              </button>
            </div>

            <TextField
              fullWidth
              label="Quantity"
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              type="number"
              margin="normal"
              inputProps={{ min: 1 }}
            />

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

            {/* Autocomplete for selecting multiple categories */}
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

            {/* File input for image */}
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

            {/* Image preview */}
            {imagePreview && (
              <Box className="image-preview">
                <img src={imagePreview} alt="Selected image preview" />
              </Box>
            )}

            {/* QR Code Files */}
            {Array.from({ length: quantity }).map((_, index) => (
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
              <Button onClick={handleSave} color="primary" variant="contained">
                Save
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AddTicketModal;
