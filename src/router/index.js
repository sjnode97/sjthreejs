import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "home",
        redirect: "/index",
        children: [
            {
                path: "/index",
                name: "index",
                component: () =>
                    import("../view/index/index"),
                meta: { title: "工作台", icon: "icon-gongzuotai" },
            },
        ],
    },

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;