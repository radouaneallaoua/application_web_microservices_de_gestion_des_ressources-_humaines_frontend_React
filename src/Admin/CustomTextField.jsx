import { TextField } from "@mui/material";
import React from "react";

const CustomTextField = ({label,name,size="normal",required,value,onChange,sx}) => {
    return (
      <TextField
        sx={sx}
        label={label}
        name={name}
        size={size}
      
        required={required}
        value={value}
        onChange={onChange}
      />
    );
}
export default CustomTextField;