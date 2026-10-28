import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductosProvider } from "./context/ProductosContext";
import { CarritoProvider } from "./context/CarritoContext";

import TiendaLayout from "./components/TiendaLayout";
import AdminLayout from "./components/AdminLayout";
import RutaProtegida from "./components/RutaProtegida";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import BlogDetalle from "./pages/BlogDetalle";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Carrito from "./pages/Carrito";
import CompraExitosa from "./pages/CompraExitosa";
import MisCompras from "./pages/MisCompras";
import NoEncontrada from "./pages/NoEncontrada";

import AdminHome from "./pages/admin/AdminHome";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminProductoForm from "./pages/admin/AdminProductoForm";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminUsuarioForm from "./pages/admin/AdminUsuarioForm";
import AdminPedidos from "./pages/admin/AdminPedidos";

// App: define qué componente se muestra en cada dirección (rutas)
// y entrega a toda la app la sesión, los productos y el carrito.
function App() {
  return (
    <AuthProvider>
      <ProductosProvider>
        <CarritoProvider>
                       <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Tienda (con Header y Footer) */}
              <Route element={<TiendaLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/producto/:id" element={<ProductoDetalle />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<BlogDetalle />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/compra-exitosa" element={<CompraExitosa />} />
                <Route
                  path="/mis-compras"
                  element={<RutaProtegida><MisCompras /></RutaProtegida>}
                />
                <Route path="*" element={<NoEncontrada />} />
              </Route>

              {/* Panel de administración: solo usuarios Administrador */}
              <Route
                path="/admin"
                element={<RutaProtegida soloAdmin><AdminLayout /></RutaProtegida>}
              >
                <Route index element={<AdminHome />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="productos/nuevo" element={<AdminProductoForm />} />
                <Route path="productos/editar/:id" element={<AdminProductoForm />} />
                <Route path="usuarios" element={<AdminUsuarios />} />
                <Route path="usuarios/nuevo" element={<AdminUsuarioForm />} />
                <Route path="usuarios/editar/:id" element={<AdminUsuarioForm />} />
                <Route path="pedidos" element={<AdminPedidos />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CarritoProvider>
      </ProductosProvider>
    </AuthProvider>
  );
}

export default App;
