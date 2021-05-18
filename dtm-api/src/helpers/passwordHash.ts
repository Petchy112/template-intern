import upash from 'upash'
import argon2 from '@phc/argon2'

upash.install('argon2', argon2)

export const generatePasswordHash = async (password: string): Promise<string> => await upash.hash(password)

export const verifyPasswordHash = (passwordHash: string, password: string): Promise<boolean> => upash.verify(passwordHash, password)
