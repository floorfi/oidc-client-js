// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from './Log.js';
import { Global } from './Global.js';
export class WebStorageStateStore {
    constructor({prefix = "oidc.", store = Global.localStorage} = {}) {
        this._store = store;
        this._prefix = prefix;
    }

    set(key, value) {
        Log.debug("WebStorageStateStore.set", key);
        console.log('Set Storage: ');
        console.log('Key: ' + key);
        console.log('Value: ' + value);
        let keyold = key
        key = this._prefix + key;

        if(this._store == Global.localStorage) {
            return new Promise((resolve) => {
                this._store.set({
                    key: key,
                    value: value
                }).then(() => {
                    this._store.get(keyold).then(storeEntry => {
                        console.log('Capacitor set Storage done')
                        console.log('Capacitor Storage Get ' + key + ' - Output: ' + storeEntry);
                        resolve();
                    });
                })
            })
        } else {
            this._store.setItem(key, value);
            return Promise.resolve();
        }
    }

    get(key) {
        Log.debug("WebStorageStateStore.get", key);
        console.log('Get Storage: ');
        console.log('Key: ' + key);

        key = this._prefix + key;

        if(this._store == Global.localStorage) {
            return new Promise((resolve) => {
                this._store.get({ key: key })
                    .then(storeEntry => {
                        console.log('Capacitor Storage Get ' + key + ' - Output: ' + storeEntry.value)
                        resolve(storeEntry.value)
                    })
            })
        } else {
            let item = this._store.getItem(key);
            return Promise.resolve(item);
        }
    }

    remove(key) {
        Log.debug("WebStorageStateStore.remove", key);
        console.log('Remove from Storage: ');
        console.log('Key: ' + key);

        if(this._store == Global.localStorage) {
            return new Promise((resolve) => {
                this.get(key).then(value => {
                    console.log('LocalStorage - remove - get value: ' + value);
                    key = this._prefix + key;
                    this._store.remove({key: key}).then(()=> {
                        console.log('gelöschter Wert: ' + value);

                        resolve(value);
                    })
                });
            });
        } else {
            let item = this._store.getItem(key);
            this._store.removeItem(key);
            return Promise.resolve(item);
        }
    }

    getAllKeys() {
        Log.debug("WebStorageStateStore.getAllKeys");

        var keys = [];

        if(this._store == Global.localStorage) {
            return new Promise((resolve) => {
                this._store.keys()
                    .then(keys => {
                        keys.forEach(key => {
                            if (key.indexOf(this._prefix) === 0) {
                                keys.push(key.substr(this._prefix.length));
                            }
                        });

                        resolve(keys);
                    })
            });
        } else {
            for (let index = 0; index < this._store.length; index++) {
                let key = this._store.key(index);

                if (key.indexOf(this._prefix) === 0) {
                    keys.push(key.substr(this._prefix.length));
                }
            }

            return Promise.resolve(keys);
        }
    }
}
