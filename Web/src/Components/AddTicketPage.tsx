"use client";
import React, { useState, useEffect } from "react";
import RichTextEditor from "@/Hooks/RichTextEditor";
import { useRouter } from "next/navigation";
import ScrollToTopButton from "@/Hooks/useScrollTopButton";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import {
  TextField,
  Button,
  Box,
  Autocomplete,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import "@/Css/AddTicketModal.css";
import uploadImageForTicket from "@/models/UpdateImage";

interface Province {
  Id: number;
  Code: string;
  Name: string;
}

interface District {
  Id: number;
  Code: string;
  Name: string;
  ProvinceId: number;
}
interface Ward {
  Id: number;
  Code: string;
  Name: string;
  DistrictId: number;
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

  const [houseNumber, setHouseNumber] = useState<string>("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const [minDateTime, setMinDateTime] = useState("");



  
  const fetchProvinces = async () => {
    try {
      const response = await fetch(
        "https://api.npoint.io/ac646cb54b295b9555be"
      );
      const data = await response.json();

      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    try {
      const response = await fetch(
        "https://api.npoint.io/34608ea16bebc5cffd42"
      );
      const data: District[] = await response.json();
      console.log(data);

      // Filter districts by ProvinceId
      const filteredDistricts = data.filter(
        (district) => district.ProvinceId === provinceId
      );
      setDistricts(filteredDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId: number) => {
    try {
      const response = await fetch(
        "https://api.npoint.io/dd278dc276e65c68cdf5"
      );
      const data: Ward[] = await response.json();
      console.log(data);

      // Filter wards by DistrictId
      const filteredWards = data.filter(
        (ward) => ward.DistrictId === districtId
      );
      setWards(filteredWards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    console.log("Updated provinces:", provinces);
  }, [provinces]);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (selectedProvinceId: number | null) => {
    setSelectedProvince(selectedProvinceId);
    setSelectedDistrict(null); // Clear district and ward when province changes
    setSelectedWard(null);
  };

  const handleDistrictChange = (selectedDistrictId: number | null) => {
    setSelectedDistrict(selectedDistrictId);
    setSelectedWard(null); // Clear ward when district changes
  };

  const handleWardChange = (selectedWardId: number | null) => {
    setSelectedWard(selectedWardId);
  };

  const getProvinceName = (provinceId: number | null) => {
    const province = provinces.find((prov) => prov.Id === provinceId);
    return province ? province.Name : "";
  };

  const getDistrictName = (districtId: number | null) => {
    const district = districts.find((dist) => dist.Id === districtId);
    return district ? district.Name : "";
  };

  const getWardName = (wardId: number | null) => {
    const ward = wards.find((wrd) => wrd.Id === wardId);
    return ward ? ward.Name : "";
  };

  // Generate full location string when province, district, and ward are selected
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      const provinceName = getProvinceName(selectedProvince);
      const districtName = getDistrictName(selectedDistrict);
      const wardName = getWardName(selectedWard);

      setFormData((prevData) => ({
        ...prevData,
        location: `${houseNumber}, ${wardName}, ${districtName}, ${provinceName}`,
      }));
    }
  }, [houseNumber, selectedProvince, selectedDistrict, selectedWard]);

  useEffect(() => {
    // Function to format the current date and time to the 'datetime-local' format
    const getCurrentDateTime = () => {
      const now = new Date();
      return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16); // Format as "YYYY-MM-DDTHH:MM"
    };

    // Set the minimum date to the current date and time
    setMinDateTime(getCurrentDateTime());
  }, []);

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
  
    if (name === "cost") {
      // Remove the '000' suffix before processing input
      let baseValue = value.replace(/000$/, '');
  
      // Remove non-numeric characters from the base value
      baseValue = baseValue.replace(/\D/g, '');
  
      // Ensure that when the user types/deletes, '000' is always appended
      setFormData({
        ...formData,
        [name]: baseValue + '000',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
      const files = Array.from(event.target.files);
      const newQrFiles = [...qrFiles];
      const newQrFileNames = [...qrFileNames];

      // Loop through each selected file and place it into the corresponding array slot
      files.forEach((file, fileIndex) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const targetIndex = index + fileIndex; // Calculate where to place the file

          // Place the file and file name in the corresponding index
          newQrFiles[targetIndex] = reader.result as string;
          newQrFileNames[targetIndex] = file.name;

          setQrFiles([...newQrFiles]);
          setQrFileNames([...newQrFileNames]);

          setFormData((prevData) => ({
            ...prevData,
            qr: newQrFiles,
          }));
        };

        reader.readAsDataURL(file);
      });
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

       
    const updateImages = async () => {
      if (selectedFile && tickets.length > 0) { 
        const firstTicket = tickets[0]; 
        console.log(firstTicket);
        
        const imageUpdateResult = await uploadImageForTicket(firstTicket, selectedFile);
        return imageUpdateResult; 
      } else {
        console.error("No file selected or no tickets available.");
        return null; 
      }
    };
      
      try {
        const imageUpdateSuccess = await updateImages(); 
        console.log("Image update success:", imageUpdateSuccess);
        console.log("Images uploaded successfully (simulated).");

        const createTicketPromises = async (ticket) => {
          await fetch("http://localhost:5296/api/Ticket/create", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ticket),
          });
        };

        await createTicketPromises(tickets);
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

          <div className="upload-container">
            <Typography
              variant="h6"
              margin="normal"
              style={{ fontSize: "20px" }}
            >
              Upload Image:
            </Typography>

            <div className="row p-3 justify-between">
              <div
                className="col-md-5 p-0  mb-4  upload-box large-box "
                onClick={() =>
                  document.getElementById("ticketImageInput")?.click()
                }
              >
                <div>
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
                    <div className="image-preview mt-3 rounded-lg">
                      <img
                        src={imagePreview}
                        alt="Selected image preview"
                        className="img-fluid"
                        style={{ width: "100%", height: "42vh" }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-5 p-3 mb-4 upload-box small-box">
                {Array.from({ length: quantity }).map((_, index) => (
                  <div key={index}>
                    <input
                      id={`qrImageInput${index}`}
                      type="file"
                      onChange={(event) => handleQrFileChange(index, event)}
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      required
                    />
                    <div className="text-center qr-text">
                      <span>QR image {index + 1}</span>
                    </div>

                    {!qrFiles[index] && (
                      <div
                        className="items-center qr-image-box"
                        onClick={() =>
                          document
                            .getElementById(`qrImageInput${index}`)
                            ?.click()
                        }
                      />
                    )}
                    {qrFiles[index] && (
                      <div
                        className="qr-preview mt-3"
                        onClick={() =>
                          document
                            .getElementById(`qrImageInput${index}`)
                            ?.click()
                        }
                      >
                        <img
                          src={qrFiles[index]}
                          alt={`QR Code ${index + 1}`}
                          className="img-fluid"
                          style={{ maxWidth: "40%", height: "auto" }}
                        />
                      </div>
                    )}
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
            type="string"
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
              type="number"
              required
            />
          {/* Location (Province, District, Ward) */}

          <div className="address-fields-container">
            <TextField
              className="address-field"
              label="House Number/Street"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              margin="normal"
              fullWidth
              required
            />

            <Autocomplete
              options={provinces}
              getOptionLabel={(option: Province) => option.Name}
              value={
                provinces.find(
                  (province) => province.Id === selectedProvince
                ) || null
              }
              onChange={(event, newValue: Province | null) => {
                handleProvinceChange(newValue ? newValue.Id : null); // Pass Id, not Name
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="address-field"
                  label="Province"
                  margin="normal"
                  fullWidth
                  required
                />
              )}
            />

            <Autocomplete
              options={districts}
              getOptionLabel={(option: District) => option.Name}
              value={
                districts.find(
                  (district) => district.Id === selectedDistrict
                ) || null
              }
              onChange={(event, newValue: District | null) => {
                handleDistrictChange(newValue ? newValue.Id : null); // Pass Id, not Name
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="address-field"
                  label="District"
                  margin="normal"
                  fullWidth
                  required
                  disabled={!selectedProvince}
                />
              )}
            />

            <Autocomplete
              options={wards}
              getOptionLabel={(option: Ward) => option.Name}
              value={wards.find((ward) => ward.Id === selectedWard) || null}
              onChange={(event, newValue: Ward | null) => {
                handleWardChange(newValue ? newValue.Id : null); // Pass Id, not Name
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="address-field"
                  label="Ward"
                  margin="normal"
                  fullWidth
                  required
                  disabled={!selectedDistrict}
                />
              )}
            />
          </div>
          <TextField
            className="custom-text-field"
            label="Please select address "
            value={formData.location}
            margin="normal"
            fullWidth
            required
            disabled={true}
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
            inputProps={{
              min: minDateTime,
            }}
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
