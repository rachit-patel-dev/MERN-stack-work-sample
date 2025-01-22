import { Request, Response, NextFunction } from 'express';
import { Status } from 'http-status';

interface UserRepository {
  findOne(query: any): Promise<any>; // Define the type for findOne method according to your implementation
}

interface JWT {
  decode(token: string): any; // Define the type for decode method according to your implementation
  verify(token: string): void; // Define the type for verify method according to your implementation
}

interface ResponseHandler {
  Fail(data: any, message: string): any; // Define the type for Fail method according to your implementation
}

interface Config {
  jwtSecret: string; // Adjust this based on your actual configuration
}

export default function AuthMiddleware({
  config,
  repository: { userRepository },
  jwt,
  response: { Fail },
}: {
  config: Config;
  repository: { userRepository: UserRepository };
  jwt: JWT;
  response: ResponseHandler;
}) {
  const tokenAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    let decodedEmail;
    try {
      const token = req.headers['authorization'];
      if (!token) {
        return res.status(Status.UNAUTHORIZED).json(Fail({}, 'Authorization token not provided'));
      }
      const decode = jwt.decode(token);
      const verify = jwt.verify(token);
      const decodedTokenData = decode(token);
      if (!decodedTokenData) {
        return res.status(Status.UNAUTHORIZED).json(Fail({}, 'Invalid token'));
      }
      verify(token);
      decodedEmail = decodedTokenData.Email;
      const currentTime = Math.round(Date.now() / 1000);
      if (currentTime > decodedTokenData.exp) {
        const error = new Error('Token expired');
        throw error;
      }
      userRepository.findOne({
        attributes: ['ID', 'Email', 'LegalName', 'Type'],
        where: {
          Email: decodedEmail,
          IsActive: 1,
        },
      }).then(data => {
        req.user = decodedTokenData;
        next();
      }).catch(error => {
        res.status(Status.UNAUTHORIZED).json(Fail({}, error));
      });
    } catch (err) {
      res.status(Status.UNAUTHORIZED).json(Fail({}, 'Invalid token'));
    }
  };

  const isBureauAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.Type === 'BUREAU') {
      next();
    } else {
      res.status(Status.UNAUTHORIZED).json(Fail({}, 'You are not a BUREAU user.'));
    }
  };

  const isAdminAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.Type === 'ADMIN') {
      next();
    } else {
      res.status(Status.UNAUTHORIZED).json(Fail({}, 'You are not an Admin user.'));
    }
  };

  return { tokenAuthenticate, isBureauAuthenticate, isAdminAuthenticate };
}
