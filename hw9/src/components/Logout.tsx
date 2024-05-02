import { Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { MouseEvent } from 'react';


import "../styles/login.css";
import Title from 'antd/es/typography/Title';

export default function Logout() {
    const navigate = useNavigate();

    const onClick = (values: MouseEvent<HTMLElement>) => {
        navigate("/");
    };

    return (
        <div className="wrap">
            <div className="container">
                <Title>Come back!</Title>
                <Button type="primary" onClick={onClick} >
                    Login page
                </Button>
            </div>
        </div>
    );
};