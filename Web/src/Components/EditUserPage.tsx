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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user profile information</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-4 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="gmail"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="gmail"
                value={formData.gmail}
                onChange={(e) =>
                  setFormData({ ...formData, gmail: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select
                value={formData.sex}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, sex: value })
                }
              >
                <SelectTrigger>
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
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={
                  formData.birthday
                    ? new Date(formData.birthday).toISOString().split("T")[0]
                    : "No birthday provided"
                }
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
              />
            </div>
            {hasR02Role && (
              <div className="space-y-2">
                <Label htmlFor="bank">Bank</Label>
                <Input
                  id="bank"
                  value={formData.bank}
                  onChange={(e) =>
                    setFormData({ ...formData, bank: e.target.value })
                  }
                  required
                />
              </div>
            )}
            {hasR02Role && (
              <div className="space-y-2">
                <Label htmlFor="bankType">Bank Type</Label>
                <Input
                  id="bankType"
                  value={formData.bankType}
                  onChange={(e) =>
                    setFormData({ ...formData, bankType: e.target.value })
                  }
                  required
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-500 hover:bg-green-400">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
