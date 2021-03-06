import sodium from 'sodium-native';
import crypto from 'crypto';

export interface IKeyPair {
    publicKey: Buffer;
    privateKey: Buffer;
}

export class Ed {

    public makeKeyPair(hash: Buffer): IKeyPair {
        const keyPair: IKeyPair = {
            publicKey: Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES),
            privateKey: Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES)
        };

        sodium.crypto_sign_seed_keypair(keyPair.publicKey, keyPair.privateKey, hash);
        return keyPair;
    }

    public sign(hash: Buffer, keyPair: IKeyPair): Buffer {
        const sig: Buffer = Buffer.alloc(sodium.crypto_sign_BYTES);
        sodium.crypto_sign_detached(sig, hash, keyPair.privateKey);
        return sig;
    }

    public verify(bytes: Uint8Array, publicKey: string, signature: string): boolean {
        const hash = crypto.createHash('sha256').update(bytes).digest();
        const signatureBuffer = Buffer.from(signature, 'hex');
        const publicKeyBuffer = Buffer.from(publicKey, 'hex');
        return sodium.crypto_sign_verify_detached(signatureBuffer, hash, publicKeyBuffer);
    }

    public makePublicKeyHex(hash: Buffer): string {
        return this.makeKeyPair(hash).publicKey.toString('hex');
    }

}

export const ed = new Ed();
