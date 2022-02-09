
import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import { NftStorageAdapter, PinataAdapter, IPFSAdapter } from '@s2g/ipfs-pinning-adapter';

import { SimpleConfig, KeySecretConfig } from '@s2g/ipfs-pinning-adapter';
import { useLocalStorage } from '@solana/wallet-adapter-react';
import { hash } from './EncryptionContext';
import { Encrypter } from '../helpers/encrypter';


export enum IpfsService {
    NFT_STORAGE = 'NFT_STORAGE',
    PINATA = 'PINATA'
}


export interface IpfsServiceMeta {
    service: IpfsService,
    name: string,
    icon: string
}

export interface IpfsServiceConfig {
    hashedPassword: string | undefined,
    service: IpfsService,
    config: (SimpleConfig | KeySecretConfig)
}

/** this is ugly, but what can we do? */
const cryptConfig = (config: IpfsServiceConfig, crypt: (string: string) => string) => {
    switch (config.service) {
        case IpfsService.NFT_STORAGE:
            return {
                ...config,
                config: {
                    apiKey: crypt((config.config as SimpleConfig).apiKey)
                } as SimpleConfig
            }
        case IpfsService.PINATA:
            const c = (config.config as KeySecretConfig)
            return {
                ...config,
                config: {
                    apiKey: crypt(c.apiKey),
                    secret: crypt(c.secret),
                } as KeySecretConfig
            }
        default:
            break;
    }
    throw Error("Unexpected service: " + config.service);
}

export const encryptConfig = (config: IpfsServiceConfig, password: string): IpfsServiceConfig => {
    return cryptConfig(config, new Encrypter(password).encrypt)
}

export const decryptConfig = (config: IpfsServiceConfig, password?: string): Promise<IpfsServiceConfig> => {
    if (!config) {
        throw new Error("No service connfig provided");
    }
    const hashPromise = password ? hash(password) : Promise.resolve(undefined);
    return hashPromise.then((hashedPassword) => {
        if (hashedPassword) {
            if (config.hashedPassword != hashedPassword) {
                throw Error("Invalid password")
            }
        }
        return password ? cryptConfig(config, new Encrypter(password).decrypt) : config
    });
}



const getAdapter = (service: IpfsServiceConfig): IPFSAdapter<any> => {
    switch (service.service) {
        case IpfsService.NFT_STORAGE:
            return new NftStorageAdapter(service.config)
        case IpfsService.PINATA:
            return new PinataAdapter(service.config as KeySecretConfig)
        default:
            break;
    }
    throw Error("Undefined pnning service: " + service.service)
}

export interface IpfsContextState {
    service: IpfsServiceMeta | undefined,
    services: IpfsServiceMeta[],
    set(service: IpfsService, config: SimpleConfig | KeySecretConfig, password?: string): void;
    upload(
        buffer: Buffer,
        password?: string
    ): Promise<string>; // cid
    reset(): void,
    getConfig(password?: string): Promise<IpfsServiceConfig | undefined>,
    getAdapter(password?: string): Promise<IPFSAdapter<any> | undefined>

}


export const IpfsServiceContext = createContext<IpfsContextState>({} as IpfsContextState);

export function useIpfsService(): IpfsContextState {
    return useContext(IpfsServiceContext);
}

export const IpfsServiceProvider: FC = ({ children, ...props }) => {
    const [serviceConfig, setServiceConfig] = useLocalStorage<IpfsServiceConfig | undefined>('IPFS_SERVICE', undefined)
    const [service, setService] = useState<IpfsServiceMeta | undefined>(undefined)
    const [services, _] = useState<IpfsServiceMeta[]>([
        {
            name: "nft.storage",
            icon: "https://avatars.githubusercontent.com/u/81696905?s=200&v=4",
            service: IpfsService.NFT_STORAGE
        },
        {
            name: "Pinata",
            icon: "https://avatars.githubusercontent.com/u/43088506?s=200&v=4",
            service: IpfsService.PINATA
        }
    ]);
    useEffect(() => {
        if (serviceConfig) {
            console.log('FIND ', services.find((service) => service.service == serviceConfig.service))
            setService(services.find((service) => service.service == serviceConfig.service));
        }
        else {
            setService(undefined)
        }

    }, [serviceConfig])
    const state = useMemo<IpfsContextState>(() => ({
        service,
        services,
        reset: () => {
            setServiceConfig(undefined);
        },
        getConfig: async (password?: string) => {
            if (!serviceConfig)
                return undefined;
            return decryptConfig(serviceConfig, password)
        },
        getAdapter: async (password?: string) => {
            if (!serviceConfig)
                return undefined;

            return getAdapter(await decryptConfig(serviceConfig, password))
        },
        // maybe have a check password method here
        set: (service: IpfsService, config: SimpleConfig | KeySecretConfig, password?: string) => {
            const hashPromise = password ? hash(password) : Promise.resolve(undefined);
            hashPromise.then((hp) => {
                const serviceConfig: IpfsServiceConfig = {
                    hashedPassword: hp,
                    config,
                    service
                };
                const encryptedConfig = password ? encryptConfig(serviceConfig, password) : serviceConfig;
                setServiceConfig(encryptedConfig);
            })
        },

        upload: async (
            buffer: Buffer,
            password?: string
        ) => {
            if (!serviceConfig) {
                throw new Error("No service connfig provided");
            }
            return getAdapter(await decryptConfig(serviceConfig, password)).pin(buffer)

        }
    }), [service, serviceConfig, services]);

    return <IpfsServiceContext.Provider value={state}>
        {children}
    </IpfsServiceContext.Provider >

}