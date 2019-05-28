export interface Config {
    url: string;
    service?: Service;
    version: string;
}

interface Service {
    ping: string;
}