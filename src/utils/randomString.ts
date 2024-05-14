import crypto from 'crypto';
const randomString = (length: number | undefined = 10) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};
export default randomString;