import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useToast } from "@/Hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import InputAddressFields from "@/Hooks/locationInputTemplate";
interface FormData {
  userid: string;
  fullName: string | undefined;
  sex: string | undefined;
  phone: string | undefined;
  address: string | undefined;
  birthday: string | undefined;
  bio: string | undefined;
}

interface EditProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FormData; // Chỉ định initialData là tùy chọn
  userId: string;
  onSave: (data: FormData) => void;
}

interface PasswordChangeProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
  initialData?: FormData; // Chỉ định initialData là tùy chọn
}

interface Passwords {
  current: string;
  new: string;
  confirm: string;
}

interface PasswordErrors {
  current?: string;
  new?: string;
  confirm?: string;
}

interface Errors {
  [key: string]: string; // Định nghĩa rằng key có thể là bất kỳ chuỗi nào và value là một chuỗi
}

// API function for updating user profile
const updateUserProfile = async (userId: string, data: any) => {
  try {
    const response = await fetch(
      `http://localhost:5296/api/User/update/${userId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Password validation
const validatePassword = (password: string) => {
  const [formData, setFormData] = useState({
    location: "",
  });
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength)
    errors.push(`Password must be at least ${minLength} characters long`);
  if (!hasUpperCase)
    errors.push("Password must contain at least one uppercase letter");
  if (!hasLowerCase)
    errors.push("Password must contain at least one lowercase letter");
  if (!hasNumbers) errors.push("Password must contain at least one number");
  if (!hasSpecialChar)
    errors.push("Password must contain at least one special character");

  return errors;
};

// Form validation
const validateForm = (formData: FormData) => {
  const errors: { [key: string]: string } = {};

  if (!formData.fullName?.trim()) errors.fullName = "Full name is required";
  if (!formData.sex) errors.sex = "Sex is required";
  if (!formData.phone?.trim()) errors.phone = "Phone number is required";
  else if (!/^\+?\d{10,}$/.test(formData.phone?.trim()))
    errors.phone = "Invalid phone number format";
  if (!formData.address?.trim()) errors.address = "Address is required";
  if (!formData.birthday) errors.birthday = "Birthday is required";

  return errors;
};

// Password Change Component
// Password Change Component
const PasswordChange = ({ isOpen, setIsOpen, userId }: PasswordChangeProps) => {
  const { toast } = useToast(); // Use the Shadcn toast hook
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [passwords, setPasswords] = useState<Passwords>({
    current: "",
    new: "",
    confirm: "",
  });
  const handleChangePassword = async (userId: string, data: any) => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5296/api/Authentication/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId: userId,
            CurrentPassword: passwords.current,
            NewPassword: passwords.new,
          }),
        }
      );

      if (response.ok) {
        alert("Password changed successfully!");
        setPasswords({
          current: "",
          new: "",
          confirm: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.title || "Error changing password"}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred while changing the password.");
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswords({
      ...passwords,
      [name]: value,
    });
    // Clear errors when user types
    if (errors[name as keyof PasswordErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords
    const newPasswordErrors = validatePassword(passwords.new);
    if (newPasswordErrors.length > 0) {
      setErrors({ new: newPasswordErrors.join(". ") });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setErrors({ confirm: "Passwords don't match" });
      return;
    }

    try {
      setIsLoading(true);
      // Add your password update API call here
      await handleChangePassword(userId, {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      // Using the Shadcn toast method
      toast({
        title: "Success",
        description: "Password updated successfully.",
        variant: "default", // Variant for success message
        duration: 5000, // Duration in milliseconds (optional)
      });
      setIsOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";

      // Using the Shadcn toast method for errors
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive", // Indicating an error variant
        duration: 5000, // Duration in milliseconds (optional)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="current"
                placeholder="Current Password"
                value={passwords.current}
                onChange={handlePasswordChange}
                className={`pr-10 ${errors.current ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                disabled={isLoading}
              ></button>
            </div>
            {errors.current && (
              <p className="text-sm text-red-500">{errors.current}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              type="password"
              name="new"
              placeholder="New Password"
              value={passwords.new}
              onChange={handlePasswordChange}
              className={errors.new ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.new && <p className="text-sm text-red-500">{errors.new}</p>}
          </div>

          <div className="space-y-1">
            <Input
              type="password"
              name="confirm"
              placeholder="Confirm New Password"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              className={errors.confirm ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.confirm && (
              <p className="text-sm text-red-500">{errors.confirm}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              className="hover:bg-gray-200 rounded"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-500 text-white hover:bg-green-400 rounded"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Profile Edit Component
const EditProfilePopup: React.FC<EditProfilePopupProps> = ({
  isOpen,
  onClose,
  initialData,
  userId,
  onSave,
}) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [houseNumber, setHouseNumber] = useState<string>(" ");
  const { toast } = useToast();
  const [formDataLocation, setFormDataLocation] = useState({
    location: "",
  });
  const HandleSubmitClick = async () => {
    await updateUserProfile(userId, formData);
    onSave(formData);
    onClose();
  };
  const [formData, setFormData] = useState<FormData>(
    initialData || {
      userid: userId,
      fullName: "",
      sex: "",
      phone: "",
      address: "",
      birthday: "",
      bio: "",
    }
  );

  // Function to validate if the age is 18 or over
  const validateBirthday = (birthday: string) => {
    const selectedDate = new Date(birthday);
    const today = new Date();

    // Calculate age by subtracting birth year from current year
    const age = today.getFullYear() - selectedDate.getFullYear();

    // Adjust age if the birthday hasn't occurred yet this year
    const hasHadBirthdayThisYear =
      today.getMonth() > selectedDate.getMonth() ||
      (today.getMonth() === selectedDate.getMonth() &&
        today.getDate() >= selectedDate.getDate());

    const finalAge = hasHadBirthdayThisYear ? age : age - 1;

    if (finalAge < 18) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        birthday: "You must be at least 18 years old.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        birthday: "",
      }));
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors when user types
    if (errors[name as keyof Errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    // Check if the input name is birthday to perform age validation
    if (name === "birthday") {
      validateBirthday(value); // Call validation function
    }
  };

  const handleSexChange = (value: string) => {
    setFormData({
      ...formData,
      sex: value,
    });
    if (errors.sex) {
      setErrors({
        ...errors,
        sex: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      await updateUserProfile(userId, formData);

      toast({
        title: "Success",
        description: "Profile updated successfully.",
        variant: "default", // Using unified type
        duration: 5000, // Optional duration
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-12 inset-0 bg-black/50 flex items-center justify-center overflow-y-auto p-4 shadow-none">
      <Card className="w-full max-w-4xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          <CardDescription>
            Make changes to your profile information
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="additional">Additional Details</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="personal">
              <Card className="border-0 space-y-4 pt-4 shadow-none border-none rounded-none">
                <CardContent className="space-y-4 pt-4 shadow-none border-none rounded-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="fullname"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sex" className="text-sm font-medium">
                        Gender
                      </Label>
                      <Select
                        value={formData.sex}
                        onValueChange={(value) =>
                          setFormData({ ...formData, sex: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthday" className="text-sm font-medium">
                        Birthday
                      </Label>
                      <Input
                        id="birthday"
                        type="date"
                        value={
                          formData.birthday &&
                          !isNaN(Date.parse(formData.birthday))
                            ? new Date(formData.birthday)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setFormData({ ...formData, birthday: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </Label>
                    <Input
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional">
              <Card>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Current Address
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Update Address
                      </Label>
                      <InputAddressFields
                        houseNumber={houseNumber}
                        setHouseNumber={setHouseNumber}
                        setFormData={setFormData}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <CardFooter className="mt-6 flex justify-end space-x-2">
              <Button
                className="hover:bg-gray-200 rounded"
                type="button"
                variant="outline"
                onClick={() => setShowPasswordDialog(true)}
                disabled={isLoading}
              >
                Change Password
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={HandleSubmitClick}
              >
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Tabs>
        <PasswordChange
          isOpen={showPasswordDialog}
          setIsOpen={setShowPasswordDialog}
          userId={userId}
          initialData={initialData}
        />
      </Card>
    </div>
  );
};

export default EditProfilePopup;
