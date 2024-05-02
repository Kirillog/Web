import { Routes, Route } from "react-router-dom";

import Login from "./Login";
import Chat from "./Chat";
import Logout from "./Logout";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat/:room" element={<Chat />} />
        <Route path="/logout" element={<Logout />} />

    </Routes>
);

export default AppRoutes;