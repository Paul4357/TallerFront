import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";

import axios from "axios";

const modalStyle = {
  position: "absolute",
  top: "10%",
  left: "50%",
  transform: "translate(-50%, 0)", // Centrado horizontal
  width: 420,
  bgcolor: "#0f1535",
  color: "white",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function UsuarioModal({ open, onClose, formData, setFormData, onSubmit }) {
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Manejo de la sumisión del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      // Datos al backend
      const response = await axios.post("http://localhost:4000/api/usuarios/crear", formData);
      console.log("Usuario agregado:", response.data);

      // Función onSubmit (para realizar cualquier acción después del envío)
      onSubmit(response.data);

      // Cerrar la modal después de guardar
      onClose();

      // Limpiar el formulario
      setFormData({
        nombre: "",
        email: "",
        password: "",
        cargo: "",
      });
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      // Manejo de errores.
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" mb={3} color="white" fontWeight="bold">
          Agregar Usuario
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <VuiInput
              fullWidth
              placeholder="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            <VuiInput
              fullWidth
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <VuiInput
              fullWidth
              type="password"
              placeholder="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <VuiInput
              fullWidth
              placeholder="Cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
            />
          </Box>

          {/* Separación entre inputs y botón */}
          <Box mt={3}>
            <VuiButton type="submit" color="info" fullWidth>
              Guardar Usuario
            </VuiButton>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
