import { Button, Form, FormProps, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import { UserOutlined, WechatOutlined } from '@ant-design/icons';


import "../styles/login.css";
import { socket } from "./Socket";
import { User } from "./model";
import Title from 'antd/es/typography/Title';

export default function Login() {
    const navigate = useNavigate();

    const onFinish: FormProps<User>['onFinish'] = (values) => {
        socket.emit("connection", values);
        navigate(`/chat/${values!.room}?name=${values!.name}`)
    };

    return (
        <div className="wrap">
            <div className="container">
                <Title>Login</Title>

                <Form onFinish={onFinish}
                    // className="form"
                    autoComplete="off"
                    labelCol={{ span: 8 }}>
                    <Form.Item<User>
                        name="name"
                        rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder='Username' />
                    </Form.Item>
                    <Form.Item<User>
                        name="room"
                        rules={[{ required: true, message: 'Please input room title!' }]} >
                        <Input prefix={<WechatOutlined className="site-form-item-icon" />} placeholder='Room' />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" className="button" >
                        Sign In
                    </Button>
                </Form>
            </div>
        </div>
    );
};