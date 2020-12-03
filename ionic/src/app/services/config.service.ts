import { Injectable } from '@angular/core';
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { Capacitor } from '@capacitor/core';

@Injectable()
export class ConfigService {

    constructor(private nativeStorage: NativeStorage) {
    }

    public async getLastPilotName(): Promise<string> {
        if (Capacitor.isPluginAvailable('NativeStorage')) {
            return await this.nativeStorage.getItem('lastPilotName') as string;
        }
        else {
            return new Promise<string>(resolve => resolve(localStorage.getItem('lastPilotName')));
        }
    }

    public async setLastPilotName(name: string): Promise<void> {
        if (Capacitor.isPluginAvailable('NativeStorage')) {
            return await this.nativeStorage.setItem('lastPilotName', name);
        }
        else {
            localStorage.setItem('lastPilotName', name);
        }
    }

}
