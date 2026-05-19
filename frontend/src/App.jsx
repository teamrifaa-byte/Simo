import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import ProductDetail from "./pages/ProductDetail";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ArticlesManagement from "./pages/admin/ArticlesManagement";
import CommandesManagement from "./pages/admin/CommandesManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import PromotionsManagement from "./pages/admin/PromotionsManagement";

const App = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/article/:id" element={<ProductDetail />} />
                <Route path="/articles/:id" element={<ProductDetail />} />

                <Route path="/checkout" element={<ProtectedRoute role="CLIENT"><Checkout /></ProtectedRoute>} />
                <Route path="/mes-commandes" element={<ProtectedRoute role="CLIENT"><OrderHistory /></ProtectedRoute>} />
                <Route path="/commandes/:id" element={<ProtectedRoute role="CLIENT"><OrderTracking /></ProtectedRoute>} />

                <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="articles" element={<ArticlesManagement />} />
                    <Route path="commandes" element={<CommandesManagement />} />
                    <Route path="categories" element={<CategoriesManagement />} />
                    <Route path="promotions" element={<PromotionsManagement />} />
                    <Route path="reapprovisionnements" element={<Navigate to="/admin/articles" replace />} />
                    <Route path="reapprovisionnement" element={<Navigate to="/admin/articles" replace />} />
                </Route>
            </Routes>
        </div>
    );
};

export default App;