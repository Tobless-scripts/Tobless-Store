import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "../../../redux/features/notifications/notificationSlice";

const Notification = () => {
    const dispatch = useDispatch();
    const { message, visible, duration } = useSelector(
        (state) => state.notification
    );

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                dispatch(hideNotification());
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible, duration, dispatch]);

    if (!visible) return null;

    return <div className={`fixed bottom-5 right-4 z-[1000] }`}>{message}</div>;
};

export default Notification;
