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

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Material-UI Pagination components
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

import axios from "axios";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    cargo: "",
  });

  // Estados para la paginación
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Número de filas por página

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

  const handleEdit = (usuario) => {
    setUsuarioEdit(usuario); // Setea el usuario a editar
    setOpen(true); // Abre el modal
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/api/usuarios/${id}`)
      .then(() => {
        setUsuarios((prev) => prev.filter((usuario) => usuario.idUsuario !== id));
      })
      .catch((err) => console.error("Error al eliminar el usuario", err));
  };

  const columns = [
    { name: "nombre", align: "center" },
    { name: "email", align: "center" },
    { name: "rol", align: "center" },
    { name: "accion", align: "center" },
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
    accion: (
      <div>
        <IconButton onClick={() => handleEdit(usuario)} sx={{ backgroundColor: "#3a416f" }}>
          <EditIcon sx={{ color: "white !important" }} />
        </IconButton>
        <IconButton
          onClick={() => handleDelete(usuario.idUsuario)}
          sx={{ backgroundColor: "#3a416f" }}
        >
          <DeleteIcon sx={{ color: "white !important" }} />
        </IconButton>
      </div>
    ),
  }));

  // Controlador para cambiar de página
  const handleChangePage = (direction) => {
    if (direction === "prev" && page > 0) {
      setPage(page - 1);
    } else if (direction === "next" && (page + 1) * rowsPerPage < rows.length) {
      setPage(page + 1);
    }
  };

  // Controlador para cambiar el número de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetea la página al cambiar el número de filas
  };

  // Filtrar las filas según la página actual y las filas por página
  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox
        py={3}
        sx={{
          backgroundColor: "primary", // Color de fondo
          display: "flex", // Flexbox para que el contenido llene todo el espacio disponible
          flexDirection: "column", // Asegura que los elementos se apilen verticalmente
          minHeight: "100vh", // Asegura que el contenido ocupe al menos toda la altura de la ventana
        }}
      >
        <VuiBox mb={3} sx={{ flex: "1" }}>
          {" "}
          {/* Flex 1 para que la tabla ocupe el espacio disponible */}
          <Card>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <VuiTypography variant="lg" color="white">
                Usuarios
              </VuiTypography>
              <button
                onClick={() => {
                  setUsuarioEdit(null);
                  setFormData({ nombre: "", email: "", password: "", cargo: "" });
                  setOpen(true);
                }}
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

            {/* Aquí agregamos el select para la cantidad de filas */}
            <VuiBox display="flex" justifyContent="flex-start" p={2}>
              <FormControl variant="outlined" size="small">
                <InputLabel id="rows-per-page-label"></InputLabel>
                <Select
                  labelId="rows-per-page-label"
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  label="Filas por página"
                  style={{ width: "200px" }} // Ancho reducido
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
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
              <Table columns={columns} rows={paginatedRows} />{" "}
              {/* Aquí pasamos las filas filtradas */}
            </VuiBox>

            {/* Paginación personalizada */}
            <VuiBox display="flex" justifyContent="flex-end" alignItems="center" p={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleChangePage("prev")}
                disabled={page === 0}
              >
                <ChevronLeftIcon sx={{ color: "white !important", fontSize: 30 }} />{" "}
                {/* Ícono de Página Anterior */}
              </Button>
              <VuiTypography variant="h6" color="white" sx={{ mx: 2 }}>
                Página {page + 1} de {Math.ceil(rows.length / rowsPerPage)}
              </VuiTypography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleChangePage("next")}
                disabled={(page + 1) * rowsPerPage >= rows.length}
              >
                <ChevronRightIcon sx={{ color: "white !important", fontSize: 30 }} />{" "}
                {/* Ícono de Página Siguiente  */}
              </Button>
            </VuiBox>
          </Card>
        </VuiBox>

        {/* Footer al final */}
        <Footer />
      </VuiBox>
    </DashboardLayout>
  );
}

export default Usuarios;
