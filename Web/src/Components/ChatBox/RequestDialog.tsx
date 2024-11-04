import React, { useState } from "react";

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
  setChatboxData,
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
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 hover:bg-gray-100  focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Description"
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
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DialogComponent: React.FC<{ setChatboxData: React.Dispatch<React.SetStateAction<any[]>> }> = ({ setChatboxData }) => {
  // Define state variables with TypeScript type annotations
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
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/api/Chatbox/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          chatboxId: "string",
          title,
          status: 0,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create chatbox');
      }

      const data = await response.json();
      setChatboxData(prevData => [...prevData, data.data]);
      console.log('Success:', data);
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <button
        className="border border-gray-300 rounded-full mb-5  bg-green-500 hover:bg-green-600 text-white px-4 py-2"
        onClick={handleOpen}
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
