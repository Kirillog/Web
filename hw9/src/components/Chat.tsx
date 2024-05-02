import { ChangeEvent, useRef } from "react";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button, Form, FormProps, Input, Popover, Upload, UploadFile, UploadProps } from "antd";
import { SendOutlined, PaperClipOutlined } from '@ant-design/icons';

import "../styles/chat.css";
import Message from "./Message"
import { ImageT, Message as MessageT, UserEvent } from "./model";
import { socket } from "./Socket";

const Chat = () => {
    const [searchParams] = useSearchParams();
    const username = searchParams.get("name")!;
    const { room } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<(MessageT | ImageT)[]>([]);
    const [messageStr, setMessageStr] = useState("");
    const [users, setUsers] = useState(0);

    const listRef = useRef(null);

    useEffect(() => {
        (listRef.current as any)?.lastElementChild?.scrollIntoView();
    }, [messages]);

    const [open, setOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const onChangeImageList: UploadProps['onChange'] = (e) => {
        setFileList(e.fileList);
    };


    type FieldType = {
        message: string;
    }

    const handleSubmit: FormProps<FieldType>['onFinish'] = (values) => {
        console.log(messageStr);
        if (!messageStr) {
            return;
        }
        console.log("emit message")
        socket.emit("message", messageStr);
        setMessages((_state) => [..._state, { text: messageStr, username }]);
        setMessageStr("");
    };

    useEffect(() => {
        socket.on("new message", (message: MessageT) => {
            console.log("new message: ", message)
            setMessages((_state) => [..._state, message]);
        });
    }, []);

    useEffect(() => {
        socket.on("user joined", (event: UserEvent) => {
            console.log("joined user: ", event)
            setUsers(event.numUsers);
        });
    }, []);

    useEffect(() => {
        socket.on("new image", (name: { username: string }, image: ArrayBuffer) => {
            console.log("new image: ", image, name);
            const reader = new FileReader();
            reader.readAsDataURL(new Blob([image]));
            reader.onloadend = () => {
                setMessages((_state) => [..._state, { body: reader.result as string, username: name.username } as ImageT]);
            }
        })

        socket.on("user left", (event: UserEvent) => {
            setUsers(event.numUsers);
        });
        socket.on('reconnect', () => {
            socket.emit("connection", { name: username, room });
        });

        socket.on('reconnect_error', () => {
            console.log('attempt to reconnect has failed');
            navigate("/");
        });
    }, []);

    const changeRoom = () => {
        socket.emit("change room", username);
        navigate("/");
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => setMessageStr(event.target.value);

    socket.emit("connection", { name: username, room });

    return (
        <div className="wrap">
            <div className="header">
                <div className="title">{room}</div>
                <div className="users">{users} users in this room</div>
                <Button type="primary" onClick={changeRoom}>
                    Leave
                </Button>
            </div>

            <div className="messages" ref={listRef}>
                {messages.map((message) => (
                    <Message username1={username} message={message} />
                ))}
            </div>

            <Form onFinish={handleSubmit}
                autoComplete="off"
                className="messageForm"
            >

                <Popover
                    content={<Upload
                        listType="picture-card"
                        onChange={onChangeImageList}
                        onPreview={() => { }}
                        customRequest={({ onSuccess, onError, file }) => {
                            console.log("request called: ", file)
                            socket.emit('image',
                                file, { username: username }
                            );
                            if (onSuccess) {
                                onSuccess!(file)
                            }
                            hide();

                        }}
                        fileList={fileList}
                    >
                        {fileList.length < 1 && '+ Upload'}
                    </Upload>}
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                >
                    <Button type="primary" icon={<PaperClipOutlined />}></Button>
                </Popover>
                {/* <Form.Item<FieldType>> */}
                <Input
                    type="text"
                    className="messageInput"
                    name="message"
                    placeholder="Write a message..."
                    value={messageStr}
                    onChange={onChange}
                    required
                />
                {/* </Form.Item> */}


                <Button type="primary" htmlType="submit" icon={<SendOutlined />} />

            </Form>
        </div >
    );
};

export default Chat;