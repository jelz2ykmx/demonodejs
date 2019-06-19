import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    BASE_URL = 'http://localhost:3000/';
    BASE_SIGNALR = this.BASE_URL + "notify";
}
