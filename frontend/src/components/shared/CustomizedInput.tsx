import TextField from "@mui/material/TextField";
type Props = {
  name: string;
  type: string;
  label: string;
};
const CustomizedInput = (props: Props) => {
  return (
    <TextField
      margin="normal"
      InputLabelProps={{ style: { color: "white" } }}
      name={props.name}
      label={props.label}
      type={props.type}
      InputProps={{
        sx: {
          width: { xs: "100%", sm: "400px",md: "400px"},
          borderRadius: 10,
          fontSize: { xs: "14px", sm: "16px",md: "20px"},
          color: "white",
        },
      }}
    />
  );
};

export default CustomizedInput;