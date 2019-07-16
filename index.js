//简单的事件库

const getEventNames = name => (name instanceof Array) //返回事件数组
    ? name
    : String(name).replace(/\s+/g, '').split(',');

export class EventEmitter {
    constructor(name = 'undefined') {
        //事件对象名称
        this.name = name;
        //事件数组
        this.events = {};
    }

    //删除事件
    destroy() {
        this.events = {};
    }

    //监听事件(options.once=>触发一次)
    on(name, callback, options = {}) {
        options = options || {};

        if (typeof callback !== 'function') {
            throw new TypeError('Invalid callback');
        }

        getEventNames(name).forEach(n => {
            if (!this.events[n]) {
                this.events[n] = [];
            }

            this.events[n].push({ callback, options });
        });

        return this;
    }

    //添加一个只触发一次的事件
    once(name, callback) {
        return this.on(name, callback, { once: true });
    }

    //删除一个事件监听
    off(name, callback = null, force = false) {
        getEventNames(name)
            .filter(n => !!this.events[n])
            .forEach(n => {
                if (callback) {
                    let i = this.events[n].length;
                    while (i--) {
                        const ev = this.events[n][i];
                        const removable = !ev.options.persist || force;
                        if (removable && ev.callback === callback) {
                            this.events[n].split(i, 1);
                        }
                    }
                } else {
                    this.events[n] = force
                        ? []
                        : this.events[n].filter(({ options }) => options.persist === true);
                }
            });
        return this;
    }

    //触发事件
    emit(name, ...args) {
        getEventNames(name).forEach(n => {
            if (this.events[n]) {
                let i = this.events[n].length;
                while (i--) {
                    const { options, callback } = this.events[n][i];

                    try {
                        callback(...args);
                    } catch (e) {
                        console.warn(e);
                    }
                    if (options && options.once) {
                        this.events[n].split(i, 1);
                    }
                }
            }
        });
        return this;
    }

}