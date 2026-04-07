import slib, { argv } from "@randajan/simple-lib";

const { isBuild } = argv;

slib(
    isBuild,
    {
        port: 3006,
        mode:"web",
        minify: false
    }
)