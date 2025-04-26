import React, { useEffect } from "react";
import { Modal, Box, Typography } from "@mui/material";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import axios from "axios";

import { toast } from "react-toastify";

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

export default function UsuarioModal({ open, onClose, formData, setFormData, onSubmit, usuario }) {
  // Si es un usuario para editar, asignamos sus datos al formulario.
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        password: "", // No se edita la contraseña aquí.
        cargo: usuario.cargo,
      });
    }
  }, [usuario, setFormData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (usuario) {
        const response = await axios.put(
          `http://localhost:4000/api/usuarios/actualizar/${usuario.idUsuario}`,
          formData
        );
        toast.success("Usuario actualizado con éxito 💾");
        onSubmit(response.data);
      } else {
        const response = await axios.post("http://localhost:4000/api/usuarios/crear", formData);
        toast.success("Usuario agregado correctamente 🎉");
        onSubmit(response.data);
      }

      onClose();
      setFormData({ nombre: "", email: "", password: "", cargo: "" });
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      toast.error("Ocurrió un error al guardar el usuario 🚫");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" mb={3} color="white" fontWeight="bold">
          {usuario ? "Editar Usuario" : "Agregar Usuario"}
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

          <Box mt={3}>
            <VuiButton type="submit" color="info" fullWidth>
              {usuario ? "Guardar Cambios" : "Guardar Usuario"}
            </VuiButton>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
