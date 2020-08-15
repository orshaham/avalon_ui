import { Injectable, EventEmitter } from '@angular/core';
import {AuthService} from './auth.service';

@Injectable()
export class SocketService {

  private socket: WebSocket;
  private listener: EventEmitter<any> = new EventEmitter();

  public constructor(private authService: AuthService) {
    if (this.authService.isAuthenticated) {
      this.openSocket();
    }
  }

  openSocket() {
    this.socket = new WebSocket('ws://localhost:12345/ws?token=' + this.authService.token); //localhost
    this.socket.onopen = event => {
      this.listener.emit({type: 'open', data: event});
    }
    this.socket.onclose = event => {
      this.listener.emit({type: 'close', data: event});
    }
    this.socket.onmessage = event => {
      this.listener.emit({type: 'message', data: JSON.parse(event.data)});
    };
  }

  public send(data: string) {
    this.socket.send(data);
  }

  public close() {
    this.socket.close();
  }

  public getEventListener() {
    return this.listener;
  }

}
