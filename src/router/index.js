import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: 'gateway',
    routes: [
        {
            path: '/',
            name: 'login',
            component: (resolve)=>require(['@/components/login2'],resolve)
        },
        // {
        //     path: '/deploy',
        //     name: 'deploy',
        //     component: (resolve)=>require(['@/components/deploy'],resolve),
        //     children:[
        //         {
        //             path: 'tecnon',
        //             name: 'tecnon',
        //             component: (resolve)=>require(['@/components/tecnon'],resolve)
        //         },
        //         {
        //             path: 'spon',
        //             name: 'spon',
        //             component: (resolve)=>require(['@/components/spon'],resolve)
        //         },
        //         {
        //             path: 'abloomy',
        //             name: 'abloomy',
        //             component: (resolve)=>require(['@/components/abloomy'],resolve)
        //         },
        //         {
        //             path: 'lonbon',
        //             name: 'lonbon',
        //             component: (resolve)=>require(['@/components/lonbon'],resolve)
        //         },
        //         {
        //             path: 'config',
        //             name: 'config',
        //             component: (resolve)=>require(['@/components/config'],resolve)
        //         },
        //         {
        //             path: 'dictionary',
        //             name: 'dictionary',
        //             component: (resolve)=>require(['@/components/dictionary'],resolve)
        //         },
        //         {
        //             path: 'dictionarygroup',
        //             name: 'dictionarygroup',
        //             component: (resolve)=>require(['@/components/dictionarygroup'],resolve)
        //         },
        //         {
        //             path: 'menu',
        //             name: 'menu',
        //             component: (resolve)=>require(['@/components/menu'],resolve)
        //         },
        //         {
        //             path: 'use',
        //             name: 'use',
        //             component: (resolve)=>require(['@/components/use'],resolve)
        //         }                                                  
        //     ]
        // },
        {
            path: '/404',
            component: (resolve)=>require(['@/components/error'],resolve)
        },
        {
            path: '*',
            redirect: '/404' 
        }
    ]
})


function getViews(path){
    return resolve => {
        require.ensure([], (require) => {
            resolve(require('@/components/' + path + '.vue'))
        })
    }
}

let newRouter = null
if(sessionStorage.router){
    newRouter = JSON.parse(sessionStorage.router)
    newRouter[0].component = getViews(newRouter[0].name)
    for(let i = 0;i < newRouter[0].children.length;i++){
        newRouter[0].children[i].component = getViews(newRouter[0].children[i].name)
    }
    router.options.routes.push(...newRouter)
    router.addRoutes(newRouter)
}


router.beforeEach((to,form,next) => {
    console.log(to,form)
    if(sessionStorage.menu){
        let formenu = JSON.parse(sessionStorage.menu)
        for(var i= 0;i < formenu.length;i++){
            if(formenu[i].childList != null){
                for(var s = 0;s < formenu[i].childList.length;s++){
                    if(to.name == formenu[i].childList[s].url){
                        sessionStorage.index = formenu[i].name
                        sessionStorage.subtitle = formenu[i].childList[s].name
                    }
                }
            }
        }
    }
    

    if(to.path != '/'){
        if(sessionStorage.tokenGATEWAY != undefined){           
            for(var i = 0;i < router.options.routes.length;i++){
                if(router.options.routes[i].name == 'deploy'){
                    next()
                    return false
                }
            }
            next({replace: true })
        }else{
            next({name:'login',params:{reload:1}})
        }
    }else if(to.path == '/' && sessionStorage.tokenGATEWAY != undefined){
        router.options.routes.push(...newRouter)
        router.addRoutes(newRouter)
        next('/config')
    }else{
        next()
    }

})

export default router

