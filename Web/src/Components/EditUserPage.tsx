import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Role } from "@/models/UserManagement";
import AddressFields from "@/Hooks/location";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import InputAddressFields from "@/Hooks/locationInputTemplate";

interface FormData {
  userId: string;
  username?: string;
  gmail?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  status: number;
  fullname?: string;
  sex?: string;
  createDate: string;
  sellConfigId?: string;
  bio?: string;
  birthday?: string;
  bank: string;
  bankType: string;
}

// Define types for props
interface EditUserDialogProps {
  roles: Role[];
  isOpen: boolean;
  onClose: () => void;
  user: FormData | null;
  onSave: (data: FormData) => void;
}

// Edit User Dialog
const EditUserDialog: React.FC<EditUserDialogProps> = ({
  roles,
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [formDataLocation, setFormDataLocation] = useState<any>({
    location: user?.address || "",
  });
  const [formData, setFormData] = useState<FormData>({
    userId: user?.userId || "",
    username: user?.username || "",
    gmail: user?.gmail || "",
    avatar: user?.avatar || "",
    phone: user?.phone || "",
    address: user?.address || "",
    status: user?.status || 0,
    fullname: user?.fullname || "",
    sex: user?.sex || "",
    createDate: user?.createDate || "",
    sellConfigId: user?.sellConfigId || "",
    bio: user?.bio || "",
    birthday: user?.birthday || "",
    bank: user?.bank || "",
    bankType: user?.bankType || "",
  });
  console.log("alo alo");
  console.log(user);
  console.log(roles);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = user?.userId; // Replace with actual userId

    const updateData = {
      username: formData.username,
      gmail: formData.gmail, // Adjust the mapping if the API expects "gmail" instead of "email"
      phone: formData.phone,
      fullname: formData.fullname,
      sex: formData.sex,
      address: formData.address,
      birthday: formData.birthday
        ? new Date(formData.birthday).toISOString()
        : null,
      bio: formData.bio,
      bank: hasR02Role ? formData.bank : null, // Only send bank if role R02 exists
      bankType: hasR02Role ? formData.bankType : null, // Only send bankType if role R02 exists
    };

    try {
      const response = await fetch(
        `http://localhost:5296/api/User/updateadmin/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user.");
      }

      const result = await response.json();
      console.log("Update successful", result);
      // Handle successful update (e.g., show success message or redirect)
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error (e.g., show error message)
    }
    onSave(formData);
    onClose();
  };
  const hasR02Role = roles.some((r) => r.roleId === "RO2");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto p-4">
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
              <Card>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gmail" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="gmail"
                        type="email"
                        value={formData.gmail}
                        onChange={(e) =>
                          setFormData({ ...formData, gmail: e.target.value })
                        }
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="fullname"
                        value={formData.fullname}
                        onChange={(e) =>
                          setFormData({ ...formData, fullname: e.target.value })
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
                        <SelectContent>
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
                          formData.birthday
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional">
              <Card>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    {hasR02Role && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bank" className="text-sm font-medium">
                            Bank
                          </Label>
                          <Input
                            id="bank"
                            value={formData.bank}
                            onChange={(e) =>
                              setFormData({ ...formData, bank: e.target.value })
                            }
                            className="w-full"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="bankType"
                            className="text-sm font-medium"
                          >
                            Bank Type
                          </Label>
                          <Input
                            id="bankType"
                            value={formData.bankType}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                bankType: e.target.value,
                              })
                            }
                            className="w-full"
                            required
                          />
                        </div>
                      </div>
                    )}

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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <CardFooter className="mt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Tabs>
      </Card>
    </div>
  );
};

// Define types for Account Status Dialog props
interface RoleStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Account Status Dialog
const RoleStatusDialog: React.FC<RoleStatusDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disable Seller</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disable this role? The user will no longer
            be able to access the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Disable
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Define types for Account Status Dialog props
interface AccountStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
  onConfirm: () => void;
}

// Account Status Dialog
const AccountStatusDialog: React.FC<AccountStatusDialogProps> = ({
  isOpen,
  onClose,
  isActive,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? "Disable Account" : "Enable Account"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive
              ? "Are you sure you want to disable this account? The user will no longer be able to access the system."
              : "Are you sure you want to enable this account? The user will regain access to the system."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              isActive
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-green-600 hover:bg-green-700"
            }
          >
            {isActive ? "Disable" : "Enable"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Define types for Reset Password Dialog props
interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Reset Password Dialog
const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Password</AlertDialogTitle>
          <AlertDialogDescription>
            This will generate a new random password for the user. The user will
            need to change their password upon next login.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Reset Password
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export {
  EditUserDialog,
  RoleStatusDialog,
  AccountStatusDialog,
  ResetPasswordDialog,
};
