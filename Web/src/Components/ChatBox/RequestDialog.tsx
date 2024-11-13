import React, { useState } from "react";
import { Chatbox } from "./RequestForm";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  setChatboxData: React.Dispatch<React.SetStateAction<any[]>>;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  onSend,
  title,
  setTitle,
  description,
  setDescription,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? "visible" : "invisible"
      }`}
    >
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="flex justify-end">
          <button type="button" onClick={onClose}>
            x
          </button>
        </div>

        <form onSubmit={onSend} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tiêu đề</label>
            <input
              type="text"
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 hover:bg-gray-100  focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả</label>
            <textarea
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 hover:bg-gray-100 focus:border-transparent"
              rows={3}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DialogComponent: React.FC<{
  chatboxData: Chatbox[];
  setChatboxData: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({ chatboxData, setChatboxData }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Chatbox/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            chatboxId: "string",
            title,
            status: 0,
            description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tạo chatbox");
      }

      const data = await response.json();
      setChatboxData((prevData) => [data.data, ...prevData]);
      console.log("Thành công:", data);
      handleClose();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const isDisabled = chatboxData.some(chatbox => chatbox.status === 1);

  return (
    <>
      <button
        className={`border border-gray-300 rounded-full mb-5 px-4 py-2 text-white ${
          isDisabled ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        }`}
        onClick={handleOpen}
        disabled={isDisabled}
      >
        Thêm
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        onSend={handleSend}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        setChatboxData={setChatboxData}
      />
    </>
  );
};

export default DialogComponent;
