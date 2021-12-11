import { Alert, Slide, Snackbar } from '@mui/material';
import React, { useState } from 'react';

export interface SimpleAlert { text: string, severity: 'error' | 'warning' | 'info' | 'success' }

interface IAlertContext {
    alert: (alert: SimpleAlert, timeout?: number) => void,
    clear: () => void
}

const AlertContext = React.createContext<IAlertContext>({
    alert: () => { },
    clear: () => { }
});

const SlideTransition = (props: any) => {
    return <Slide {...props} direction="up" />;
}
const AlertProvider = ({ children }: { children: JSX.Element }) => {
    const [alert, setAlert] = useState<SimpleAlert | undefined>(undefined);
    return (
        <AlertContext.Provider
            value={{
                alert: (alert: SimpleAlert, timeout: number = 10000) => {
                    setAlert(alert);
                    setTimeout(() => {
                        setAlert(undefined);
                    }, timeout)

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