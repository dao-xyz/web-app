import { Alert, Slide, Snackbar } from '@mui/material';
import React, { useState } from 'react';

export interface SimpleAlert { text: string, severity: 'error' | 'warning' | 'info' | 'success' }

interface IAlertContext {
    alert: (alert: SimpleAlert, timeout?: number) => Promise<void>,
    clear: () => void
}

const AlertContext = React.createContext<IAlertContext>({
    alert: async () => { },
    clear: () => { }
});
const wait = (delay: number) => {
    return new Promise(res => setTimeout(res, delay));
}
const SlideTransition = (props: any) => {
    return <Slide {...props} direction="up" />;
}
const AlertProvider = ({ children }: { children: JSX.Element }) => {
    const [alert, setAlert] = useState<SimpleAlert | undefined>(undefined);
    return (
        <AlertContext.Provider
            value={{
                alert: async (alert: SimpleAlert, timeout: number = alert.severity === 'error' ? 15000 : 7000) => {
                    setAlert(alert);
                    await wait(timeout)
                    setAlert(undefined);
                },
                clear: () => (setAlert(undefined)),
            }}
        >
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={!!alert}
                TransitionComponent={SlideTransition}
                key={alert?.severity}
            >
                <Alert severity={alert?.severity}>{alert?.text}</Alert>
            </Snackbar>
            {children}
        </AlertContext.Provider>
    );
};

export { AlertProvider };
export default AlertContext;