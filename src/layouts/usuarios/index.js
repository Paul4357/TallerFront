import React, { useEffect, useState } from "react";

import UsuarioModal from "./components/UsuarioModal";

// Vision UI Components
import Card from "@mui/material/Card";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    cargo: "",
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al cargar usuarios", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:4000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Usuario agregado:", data);
        setOpen(false);
        setFormData({ nombre: "", email: "", password: "", cargo: "" });
        setUsuarios((prev) => [...prev, data]);
      })
      .catch((err) => console.error("Error al agregar usuario", err));
  };

  const columns = [
    { name: "nombre", align: "left" },
    { name: "email", align: "left" },
    { name: "rol", align: "center" },
  ];

  const rows = usuarios.map((usuario) => ({
    nombre: (
      <VuiTypography variant="button" color="white" fontWeight="medium">
        {usuario.nombre}
      </VuiTypography>
    ),
    email: (
      <VuiTypography variant="button" color="white">
        {usuario.email}
      </VuiTypography>
    ),
    rol: (
      <VuiTypography variant="button" color="white">
        {usuario.cargo}
      </VuiTypography>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <VuiTypography variant="lg" color="white">
                Lista de Usuarios
              </VuiTypography>
              <button
                onClick={() => setOpen(true)}
                style={{
                  backgroundColor: "#3a416f",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                + Nuevo Usuario
              </button>
            </VuiBox>
            <VuiBox
              sx={{
                "& th": {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[700]}`,
                },
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                      `${borderWidth[1]} solid ${grey[700]}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={rows} />
            </VuiBox>
          </Card>
        </VuiBox>
      </VuiBox>

      {/* Modal para agregar usuario */}
      <UsuarioModal
        open={open}
        onClose={() => setOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <Footer />
    </DashboardLayout>
  );
}

export default Usuarios;
