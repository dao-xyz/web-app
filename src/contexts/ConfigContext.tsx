import React, { useContext, useEffect } from "react";

interface Config {
    rootTrustCID: string,
    trustShardCID: string,
    postShardCID: string,
    usersShardCID: string
}

interface IConfigContext {
    config: Config
}
export const ConfigContext = React.createContext<IConfigContext>({} as any);
export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }: { children: JSX.Element }) => {
    const [config, setConfig] = React.useState<Config>({

        rootTrustCID: "QmUAs67w3EwFqZneRuzPvEdMKowFLeD3ArDtb35r3Dy98h",
        trustShardCID: "QmNWoaLbKDVDPUYGctMuQUUtNPfPjGQg3mPhZWvPKHcHdb",
        postShardCID: "QmRaRGXAspRj7g8ZmRNLuSyfeLwdgr8d1MPv7vg8ywGFjZ",
        usersShardCID: "QmUYSmze7F3dBUcKio8sdRQVuvZDdU1wi9LZCY4dg4uJxV"
    });
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
