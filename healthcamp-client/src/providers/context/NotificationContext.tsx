import { ReactNode, createContext, useState } from "react";
interface NotificationContextType {

}

const NotificationContext = createContext<NotificationContextType | null>(null);

const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("");

    const setNotificationTitle = (arg: string) => {
        setTitle(arg)
    }
    const setNotificationColor = (arg: string) => {
        setColor(arg)
    }
    return (
        <NotificationContext.Provider value={{ title, setNotificationTitle, color, setNotificationColor }}>
            {children}
        </NotificationContext.Provider>
    )
}

export { NotificationProvider, NotificationContext }