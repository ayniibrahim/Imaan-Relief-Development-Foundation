import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const generateToken = (id: string, role: string): string => {
  const secret: Secret = process.env.JWT_SECRET || 'imaan-relief-super-secret-jwt-key-2025';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign({ id, role }, secret, options);
};
