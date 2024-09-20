import { DecodedToken } from '../middlewares/auth';

declare global {
    namespace Express {
        interface Request {
            userId?: DecodedToken;
        }
    }
}