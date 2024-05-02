import React, { ChangeEvent, useState } from "react";
import { Image } from 'antd';

import { ImageT, Message as MessageT } from "./model";

import "../styles/message.css"

const Message = ({ username1: username, message }: { username1: string, message: MessageT | ImageT }) => {
    const className = username === message.username ? "me" : "user";

    if ("text" in message) {

        return (
            <div className={`message ${className}`}>
                <span className="user">{message.username}</span>
                <div className="text">{message.text}</div>
            </div>
        );
    } else {

        return (
            <div className={`message ${className}`}>
                <span className="user">{message.username}</span>
                <Image className="text" src={message.body} width="30rem" height="auto"></Image>
            </div >
        );
    }
}

export default Message;
