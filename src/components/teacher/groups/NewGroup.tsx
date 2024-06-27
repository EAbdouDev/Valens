"use client";

import { FC, useState, useEffect, FormEvent } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useAuth } from "@/components/auth/auth-provider";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
}

interface NewGroupProps {}

const NewGroup: FC<NewGroupProps> = ({}) => {
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const userId = auth?.currentUser?.uid;
  const router = useRouter();
  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length > 0) {
        try {
          const response = await fetch(
            `/api/searchUsers?searchTerm=${searchTerm}`
          );
          const data = await response.json();
          setSearchResults(data.users);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        setSearchResults([]);
      }
    };

    searchUsers();
  }, [searchTerm]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      setError("At least one student must be selected");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/createGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupName, selectedUsers, userId }),
      });

      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else {
        setGroupName("");
        setSelectedUsers([]);
        setError(null); // Clear the error if submission is successful
        router.push("/t/groups");
        router.refresh();
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setIsLoading(false);
    }
  };

  const handleAddUser = (event: any, user: User | null) => {
    if (user && !selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  useEffect(() => {
    if (selectedUsers.length > 0) {
      setError("");
    }
  }, [error, selectedUsers]);

  return (
    <div>
      <h1 className="text-2xl font-medium mb-10">Create New Group</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div className="">
          <TextField
            type="text"
            label="Group Name"
            variant="outlined"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Cardiology group..."
            required
            className="w-[50%] border-2 rounded-lg p-2"
          />
        </div>

        <div className="">
          <Autocomplete
            className="rounded-lg w-[50%]"
            options={searchResults}
            getOptionLabel={(option: User) => option.name}
            onInputChange={(event, newInputValue) => {
              setSearchTerm(newInputValue);
            }}
            onChange={handleAddUser}
            renderOption={(props, option: User) => (
              <ListItem {...props}>
                <ListItemAvatar>
                  <Avatar alt={option.name} src={option.photoURL} />
                </ListItemAvatar>
                <ListItemText primary={option.name} secondary={option.email} />
              </ListItem>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add Students"
                variant="outlined"
                placeholder="Search for student name or email"
              />
            )}
          />
        </div>

        {selectedUsers.length > 0 && (
          <div className="space-y-4 pt-4 ">
            <h2 className="font-medium">Selected Students</h2>
            <ul className="space-y-2">
              {selectedUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center gap-2 w-[50%] py-2 px-4 hover:bg-slate-100 rounded-lg bg-gray-100"
                >
                  <div className="flex justify-start items-center gap-2">
                    <Avatar alt={user.name} src={user.photoURL} />
                    <div className="">
                      <h3>{user.name}</h3>
                      <p className="text-sm opacity-60">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    <X />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <div className="w-[50%] flex justify-end items-end pt-6">
          <button
            disabled={isLoading}
            type="submit"
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? (
              <p className="flex justify-center items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Creating...
              </p>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewGroup;
