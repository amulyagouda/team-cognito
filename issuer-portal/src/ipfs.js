import { Web3Storage } from "web3.storage";

export function getAccessToken() {
  return process.env.REACT_APP_WEB3STORAGE_TOKEN;
}

export function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export async function uploadToIPFS(file) {
  const client = makeStorageClient();
  const cid = await client.put([file], { wrapWithDirectory: false });
  return cid;
}
