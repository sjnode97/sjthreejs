import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "home",
        redirect: "/cannon",
        children: [
            {
                path: "/index",
                name: "index",
                component: () =>
                    import("../view/index/index"),
                meta: { title: "工作台", icon: "icon-gongzuotai" },
            },
            {
                path: "/point",
                name: "point",
                component: () =>
                    import("../view/point/index"),
                meta: { title: "工作台", icon: "icon-gongzuotai" },
            },
            {
                path: "/snowflake",
                name: "snowflake",
                component: () =>
                    import("../view/snowflake/index"),
                meta: { title: "雪花", icon: "icon-gongzuotai" },
            },
            {
                path: "/rayCasting",
                name: "rayCasting",
                component: () =>
                    import("../view/rayCasting/index"),
                meta: { title: "光线投射", icon: "icon-gongzuotai" },
            },
            {
                path: "/threeFull",
                name: "threeFull",
                component: () =>
                    import("../view/threeFull/index"),
                meta: { title: "滚动html", icon: "icon-gongzuotai" },
            },
            {
                path: "/cannon",
                name: "cannon",
                component: () =>
                    import("../view/cannon/index"),
                meta: { title: "cannon物理引擎", icon: "icon-gongzuotai" },
            },
        ],
    },
    {
        path: '/:pathMatch(.*)',
        name: 'error',
        component: import("../view/error/index"),
        meta: { title: '404' },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;