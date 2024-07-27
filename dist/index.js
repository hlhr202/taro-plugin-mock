"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./Server");
const express = require("express");
const utils_1 = require("./utils");
const cors = require("cors");
exports.default = (ctx, pluginOpts) => {
    ctx.addPluginOptsSchema(joi => {
        return joi.object().keys({
            mocks: joi.object().pattern(joi.string(), joi.object()),
            port: joi.number(),
            host: joi.string()
        });
    });
    let isFirstWatch = true;
    ctx.onBuildFinish(async ({ isWatch }) => {
        let needStart = !isWatch || isFirstWatch;
        if (needStart) {
            const { appPath } = ctx.paths;
            const { mocks, port, host } = pluginOpts;
            const helper = ctx.helper;
            const server = new Server_1.default({
                port,
                host,
                middlewares: [
                    express.json(),
                    cors(),
                    utils_1.createMockMiddleware({
                        appPath,
                        mocks,
                        helper
                    })
                ]
            });
            await server.start(helper);
            process.on('SIGINT', function () {
                console.log('数据 mock 服务已关闭.');
                process.exit();
            });
        }
        isFirstWatch = false;
    });
};
//# sourceMappingURL=index.js.map