"use client";
import React, { useState, useEffect } from "react";
import RichTextEditor from "@/Hooks/RichTextEditor";
import { useRouter } from "next/navigation";
import ScrollToTopButton from "@/Hooks/useScrollTopButton";
import {
  TextField,
  Button,
  Box,
  Autocomplete,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import "@/Css/AddTicketModal.css";

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

const AddTicketModal: React.FC = () => {
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [qrFileNames, setQrFileNames] = useState(Array(quantity).fill(""));
  const [qrFiles, setQrFiles] = useState(Array(quantity).fill(null));
  const router = useRouter();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    };
    await createTickets();
    router.push("/sell");
    window.location.href = "/sell";
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setSelectedFile(null);
    setQrFiles([]);
    setQuantity(1);
    setQrFileNames([]);
    setImagePreview(null);
    router.push("/sell");
  };

  return (
    <div>
      <Box className="modal-style">
        <div className="modal-contentt">
          <ScrollToTopButton />
          <h2>Add Ticket</h2>
          <TextField
            className="custom-text-field"
            fullWidth
            label="Quantity"
            value={quantity}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            type="number"
            margin="normal"
            inputProps={{ min: 1 }}
          />

          {/* File input for image */}

          <div className="container upload-container">
            <Typography
              variant="h6"
              margin="normal"
              style={{ fontSize: "20px" }}
            >
              Upload Image:
            </Typography>

            <div className="row">
              <div className="col-md-6">
                <div
                  className="upload-box large-box"
                  onClick={() =>
                    document.getElementById("ticketImageInput")?.click()
                  }
                >
                  <input
                    id="ticketImageInput"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                    placeholder="Ticket image"
                    required
                  />
                  {!imagePreview && (
                    <div className="text-center mt-3">
                      <span>Ticket image</span>
                    </div>
                  )}

                  {imagePreview && (
                    <div className="image-preview mt-3">
                      <img
                        src={imagePreview}
                        alt="Selected image preview"
                        className="img-fluid"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                {Array.from({ length: quantity }).map((_, index) => (
                  <div key={index} className="mb-3">
                    <div
                      className="upload-box small-box"
                      onClick={() =>
                        document.getElementById(`qrImageInput${index}`)?.click()
                      }
                    >
                      <input
                        id={`qrImageInput${index}`}
                        type="file"
                        onChange={(event) => handleQrFileChange(index, event)}
                        accept="image/*"
                        style={{ display: "none" }}
                        required
                      />
                      <div className="text-center mt-3">
                        <span>QR image {index + 1}:</span>
                      </div>
                      {qrFiles.map(
                        (file, idx) =>
                          idx === index &&
                          file && (
                            <div key={idx} className="qr-preview mt-3">
                              <img
                                src={file}
                                alt={`QR Code ${index + 1}`}
                                className="img-fluid"
                              />
                            </div>
                          )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TextField
            className="custom-text-field"
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              style: { color: "blue" },
            }}
            required
          />

          <TextField
            className="custom-text-field"
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
            className="custom-text-field"
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            className="custom-text-field"
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
              <TextField
                className="custom-text-field"
                {...params}
                label="Categories"
                margin="normal"
              />
            )}
            loading={loading}
            isOptionEqualToValue={(option, value) =>
              option.categoryId === value.categoryId
            }
          />
          <div className="border rounded-md mb-4 ">
            <div className="custom-text-field">
              <RichTextEditor
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default AddTicketModal;
