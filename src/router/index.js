import Vue from 'vue'
import Router from 'vue-router'
import global from '../utils/auth'
Vue.use(Router)

const router = new Router({
    routes: [{
        path: '/',
        redirect() {
            return '/console'
        }
    }, {
        path: '/login',
        component: () =>
            import ('@/page/login'),
        meta: {
            title: '登录'
        }
    }, {
        path: '/layout',
        component: () =>
            import ('@/components/index'),
        meta: {
            title: '首页'
        },
        children: [{
                path: '/console',
                component: () =>
                    import ('@/components/console'),
                meta: {
                    title: '控制台'
                }
            }, {
                path: '/numberOrder',
                component: () =>
                    import ('@/components/numberOrder'),
                meta: {
                    title: '账号订单'
                }
            }, {
                path: '/giftOrder',
                component: () =>
                    import ('@/components/giftOrder'),
                meta: {
                    title: '礼物订单'
                }
            }, {
                path: '/toBuy',
                component: () =>
                    import ('@/components/toBuy'),
                meta: {
                    title: '求购列表'
                }
            }, {
                path: '/shelves',
                component: () =>
                    import ('@/components/shelves'),
                meta: {
                    title: '已上架'
                }
            }, {
                path: '/unshelves',
                component: () =>
                    import ('@/components/unshelves'),
                meta: {
                    title: '已下架'
                }
            }, {
                path: '/add',
                component: () =>
                    import ('@/components/add'),
                meta: {
                    title: '添加账号'
                }
            }, {
                path: '/addGift',
                component: () =>
                    import ('@/components/addGift'),
                meta: {
                    title: '添加礼物'
                }
            }, {
                path: '/shop',
                component: () =>
                    import ('@/components/shop'),
                meta: {
                    title: '店铺装修'
                }
            }, {
                path: '/fund',
                component: () =>
                    import ('@/components/fund'),
                meta: {
                    title: '资产管理'
                }
            }, {
                path: '/merchant',
                component: () =>
                    import ('@/components/merchant'),
                meta: {
                    title: '商家管理'
                }
            }, {
                path: '/merchdetail',
                component: () =>
                    import ('@/components/merchDetail'),
                meta: {
                    title: '商家详情'
                }
            }, {
                path: '/admin',
                component: () =>
                    import ('@/components/admin'),
                meta: {
                    title: '管理员管理'
                }
            }, {
                path: '/authority',
                component: () =>
                    import ('@/components/authority'),
                meta: {
                    title: '权限管理'
                }
            }, {
                path: '/info',
                component: () =>
                    import ('@/components/info'),
                meta: {
                    title: '个人信息'
                }
            }, {
                path: '/withdraw',
                component: () =>
                    import ('@/components/withdraw'),
                meta: {
                    title: '用户提现'
                }
            }, {
                path: '/accountAudit',
                component: () =>
                    import ('@/components/accountAudit'),
                meta: {
                    title: '账号审核'
                }
            }, {
                path: '/user',
                component: () =>
                    import ('@/components/user'),
                meta: {
                    title: '用户管理'
                }
            },
            {
                path: '/auditDetail',
                component: () =>
                    import ('@/components/auditDetail'),
                meta: {
                    title: '账号审核详情'
                }
            },
            {
                path: '/giftDetail',
                component: () =>
                    import ('@/components/giftDetail'),
                meta: {
                    title: '礼物审核详情'
                }
            },
            {
                path: '/merchantAudit',
                component: () =>
                    import ('@/components/merchantAudit'),
                meta: {
                    title: '商家审核'
                }
            },
            {
                path: '/giftAudit',
                component: () =>
                    import ('@/components/giftAudit'),
                meta: {
                    title: '礼物审核'
                }
            },
            {
                path: '/editAdd',
                component: () =>
                    import ('@/components/editAdd'),
                meta: {
                    title: '编辑账号'
                }
            },
            {
                path: '/editGift',
                component: () =>
                    import ('@/components/editGift'),
                meta: {
                    title: '编辑礼物'
                }
            },
            {
                path: '/setting',
                component: () =>
                    import ('@/components/setting'),
                meta: {
                    title: '平台设置'
                }
            },
            {
                path: '/editPwd',
                component: () =>
                    import ('@/components/editPwd'),
                meta: {
                    title: '账号改密'
                }
            }

        ]
    }]
})
router.beforeEach((to, from, next) => {
    var token = global.getToken('username')
    if (token) {
        next()
    } else {
        if (to.path == '/login') {
            next()
        } else {
            next('/login')
            return
        }

    }

})
export default router