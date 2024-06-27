"use client";

import { FC, useState, useEffect, FormEvent } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useAuth } from "@/components/auth/auth-provider";

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
  const auth = useAuth();
  const userId = auth?.currentUser?.uid;

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

    try {
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
        console.log(data.message);
        setGroupName("");
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleAddUser = (event: any, user: User | null) => {
    if (user && !selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  return (
    <div>
      <h1>Create New Group</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          required
        />
        <button type="submit">Create Group</button>
      </form>

      <h2>Search Users</h2>
      <Autocomplete
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
          <TextField {...params} label="Search Users" variant="outlined" />
        )}
      />

      <h2>Selected Users</h2>
      <ul>
        {selectedUsers.map((user) => (
          <li key={user.id}>
            <Avatar alt={user.name} src={user.photoURL} />
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewGroup;
