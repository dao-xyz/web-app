
import React, { useEffect, useState } from 'react';
import { NFTStorage, File } from 'nft.storage'
import { pack } from 'ipfs-car/pack';

const apiKey = 'YOUR_API_KEY'



interface IIPFSContext {
    get: (cid: string) => Promise<void>
}

const IPFSContext = React.createContext<IIPFSContext>({
    get: async (_: string) => { },
});
let ipfs: NFTStorage | null = null

const IPFSProvider = ({ children }: { children: JSX.Element }) => {
    const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs))
    const [ipfsInitError, setIpfsInitError] = useState(false)

    useEffect(() => {
        // The fn to useEffect should not return anything other than a cleanup fn,
        // So it cannot be marked async, which causes it to return a promise,
        // Hence we delegate to a async fn rather than making the param an async fn.

        startIpfs()

    }, [])

    async function startIpfs() {
        if (ipfs) {
            console.log('IPFS already started')
        } else {
            try {
                ipfs = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlERDkzNDQ0QzlBZjUwODc2ODA3MjZDQmNCMTQ1MzljMzBFREE5NjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MjQwMDc1NDE4OSwibmFtZSI6InRlc3QifQ.aZHLQTkUEic8TL0yVb0vPQSJmktrXZU96cbY-JdE6xA" })
                /*          console.log('GET CID');
                         let result = await ipfs?.cat("bafkreidqivwakd7g3pmgcvabcxbkwukxps3efbhbrmzm6qyn7np43smhiu");
                         console.log(result)
                         console.timeEnd('IPFS Started') */
                const metadata = await ipfs.store({
                    name: 'Pinpie',
                    description: 'Pin is not delicious beef!',
                    image: new File([], 'pinpie.jpg', { type: 'image/jpg' })
                })
                console.info(metadata)
            } catch (error) {
                console.error('IPFS init error:', error)
                ipfs = null
                setIpfsInitError(true)
            }
        }
        setIpfsReady(Boolean(ipfs))
    }

    return (
        <IPFSContext.Provider value={{
            get: async (cid: string) => {

            },
        }}>

            {children}
        </IPFSContext.Provider >
    );
};

export { IPFSProvider };
export default IPFSContext;