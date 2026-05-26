import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';
import logger from 'src/helper/utils/logger.util';

@Injectable()
export class ErrorLoggerMiddleware implements NestMiddleware {
  private morganErrorFormat: morgan.FormatFn = (tokens: any, req: any, res: any) => {
    if (res.statusCode >= 400 && res.statusCode != 401) {
      return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        message: res.locals.errorMessage || 'Unknown error', 
        timestamp: tokens.date(req, res, 'clf'),
      });
    }
    return null; // Skip logging for non-error responses
  };

  private morganInstance = morgan(this.morganErrorFormat, {
    stream: {
      write: (message: string) => {
        if (message) {
          logger.error(message.trim());
        }
      },
    },
    skip: (req: Request, res: Response) => res.statusCode < 400, // Skip non-error responses
  });

  use(req: Request, res: Response, next: NextFunction) {
    // Intercept errors before response is sent
    const originalSend = res.send;
    res.send = function (body: any) {
      if (res.statusCode >= 400 && res.statusCode != 401) {
        res.locals.errorMessage =
          typeof body === 'object' && body.message ? body.message : String(body);
        }
        return originalSend.call(this, body);

    };

    this.morganInstance(req, res, next);
  }
}
