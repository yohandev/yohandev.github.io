import TOML from "@ltd/j-toml";


export class Video {
    static cache = {};

    static async load(id) {
        if (id in this.cache) {
            return this.cache[id];
        }
        return fetch(`assets/videos/${id}.toml`)
            .then(res => res.text())
            .then(txt => TOML.parse(txt, ' '))
            .then(toml => this.cache[id] = toml);
    }
}