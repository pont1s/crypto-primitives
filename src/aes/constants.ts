import { EccCurves, SymmetricAlg, SymmetricAlgKeyLength } from './types';

export const ECC_SHARED_ALG = 'ECDH';
export const ECDH_CURVE_DEFAULT = EccCurves.P384;

export const SYMMETRIC_ALG_DEFAULT = SymmetricAlg.AES_GCM;
export const SYMMETRIC_ALG_LENGTH_DEFAULT = SymmetricAlgKeyLength.B256;
export const CTR_LEN_DEFAULT = 64;
