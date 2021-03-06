/* eslint-disable */
//
// nuxt.config.js

require("dotenv").config({
    path: "./config/env/" + process.env.ENV_FILE
});

const Lang = process.env.LANG;
const isDev = process.env.GENERATE != 1;
const Generate = process.env.GENERATE == 1;
const RouteLang = Generate ? `/${Lang}` : "";
const Dir = `${process.env.DIR + RouteLang}`;
const BaseUrl = `${process.env.PROTOCOL + process.env.SUBDOMAIN + process.env.DOMAIN + process.env.SUBFOLDER + RouteLang}`;
const RouterBase = `${process.env.SUBFOLDER + RouteLang}/`;
const {pages, config} = require(`./data/${Lang}.json`);

const routes = [];
for (const id in pages) {
    const page = pages[id];
    const route = page.type ? `${config.routes[page.type]}/${id}` : `${config.routes[id]}`;
    routes.push(route);
}

console.log(`LANG: ${Lang}\nGENERATE: ${Generate}\nBASE URL: ${BaseUrl}\nROUTES:`);
for (const route of routes) {
    console.log(`  · ${route}`);
}
console.log("\n");

export default {

    env: {
        lang: Lang,
        head: config.head,
        generate: Generate,
        baseUrl: BaseUrl,
        routerBase: RouterBase
    },

    server: {
        host: "0.0.0.0"
    },

    router: {
        base: RouterBase
    },

    plugins: [
        {
            src: "~/plugins/Server.js",
            ssr: true
        },
        {
            src: "~/plugins/Client.js",
            ssr: false
        }
    ],

    modules: [
        ["@nuxtjs/pwa", {icon: true, manifest: true}],
        "@nuxtjs/axios",
        "@nuxtjs/router",
        "@nuxtjs/style-resources"
    ],

    axios: {
        baseURL:"http://10.0.56.26:3000",
        proxy: true
    },

    styleResources: {
        scss: [
            "assets/css/_variables.scss",
            "assets/css/_mixins.scss"
        ]
    },

    css: ["@/assets/css/style.scss"],

    loading: false,

    ignore: [],

    workbox: {
        cachingExtensions: "@/plugins/workbox-range-request.js",
        offline: true,
        offlineAnalytics: true
    },

    meta: {
        mobileAppIOS: true,
        nativeUI: true,
        appleStatusBarStyle: "black"
    },

    manifest: {
        name: "Nuxt Starter",
        short_name: "Nuxt Starter",
        description: "Nuxt Starter PWA Ready",
        lang: `${Lang}`,
        orientation: "portrait-primary",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        start_url: `${RouterBase}`,
        display: "standalone",
        crossorigin: "use-credentials"
    },

    icon: {
        iconSrc: "static/img/logo.png"
    },

    vue: {
        config: {
            productionTip: isDev ? false : true,
            devtools: true
        }
    },

    build: {
        analyze: false,
        extractCSS: true,
        terser: isDev ? false : {
            terserOptions: {
                output: {
                    comments: false
                },
                compress: {
                    drop_console: (process.env.NODE_ENV === "production")
                }
            }
        },
        extend(config, {isClient}) {
            config.module.rules.push({
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /(node_modules)/,
                use: [
                  "raw-loader",
                  "glslify-loader"
                ]
            });
            config.output.globalObject = "this"
            if (isClient) { // web workers are only available client-side
                config.module.rules.push({
                    test: /\.worker\.js$/, // this will pick up all .js files that ends with ".worker.js"
                    loader: 'worker-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    },

    generate: {
        dir: Dir,
        routes: routes,
        fallback: true
    }
};
