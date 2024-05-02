import { Routes, Route } from "react-router-dom";

import Login from "./Login";
import Chat from "./Chat";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat/:room" element={<Chat />} />
    </Routes>
);

export default AppRoutes;