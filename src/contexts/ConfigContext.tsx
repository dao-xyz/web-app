import React, { useContext, useEffect } from "react";

interface Config {
    rootPostShard: string,
}


interface IConfigContext {
    config: Config
}
export const ConfigContext = React.createContext<IConfigContext>({} as any);
export const useConfig = () => useContext(ConfigContext);
export const ConfigProvider = ({ children }: { children: JSX.Element }) => {
    const [config, setConfig] = React.useState<Config>({ "rootPostShard": "Qmf4op8fyNDxS7CiKrvbxttGRubugvuYEVUHzs61b36AQ3" });
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
