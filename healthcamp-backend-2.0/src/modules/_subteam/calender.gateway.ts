import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { CalenderService } from './calender.service';
import { InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { CalenderService } from '../_calender/calender.service';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
}) export class CalenderGateway {

    @WebSocketServer()
    server: Server;

    constructor(private readonly calenderService: CalenderService) { }

    @SubscribeMessage('caldender')
    getCalender(@ConnectedSocket() client: Socket,) {
        try {
            if (!client) {
                throw new NotAcceptableException("client is undefined")
            }
            client.emit('createData', this.calenderService.getAll());
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
