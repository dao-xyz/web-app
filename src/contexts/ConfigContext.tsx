import React, { useContext, useEffect } from "react";

interface Config {
    rootTrust: string,
    rootTrustShard: string,
    rootPostShard: string,
    rootUsersShard: string
}


interface IConfigContext {
    config: Config
}
export const ConfigContext = React.createContext<IConfigContext>({} as any);
export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }: { children: JSX.Element }) => {
    const [config, setConfig] = React.useState<Config>({ "rootTrust": "Qme3snzS2C9U4ggLMEqrPAYQFiWqWq9R6UBvkNnLFHwd4h", "rootTrustShard": "QmemEtCJ8uzZyXGZpbY66tDQm8Q84kLpkPzBPA53DUJkZU", "rootPostShard": "QmcxnDyaJ8KqNx3EVpa3UG1WejeqjiUGuWg9qJa785YCBk", "rootUsersShard": "QmX2huH26PQu4pGkviKR46AxyweVTeV5HgbkmeNWFkWQuw" });
    const memo = React.useMemo<IConfigContext>(
        () => ({
            config
        }),
        [config]
    );

    return (
        <ConfigContext.Provider value={memo}>
            {children}
        </ConfigContext.Provider>
    );
};
