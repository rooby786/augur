export default {
    async addComparedRepo(context:any, payload:any) {

        // type is not valid
        if (context.state.baseGroup != '') {
            return
        }

        context.state.compare = 'zcore';

        if (context.state.baseRepo == ''){
            context.state.baseRepo = payload.url
        }
        if(!(context.state.comparedRepos.includes(payload.url) && context.state.baseRepo == payload.url)) {
            context.state.comparedRepos.push(payload.url)
        }
        if (!(payload.url in context.rootGetters['common/apiRepos'])) {
            context.dispatch('common/addRepo',payload,{root:true})
        }
    },

    async addComparedGroup(context:any, payload:any) {
        // type is not valid
        if (context.state.baseRepo != '') {
            return
        }
        context.state.compare = 'zcore';
        if (context.state.baseGroup == ''){
            context.state.baseGroup = payload.rg_name
        }
        if(!context.state.comparedRepoGroups.includes(payload.rg_name) && context.state.baseGroup != payload.rg_name) {
            context.state.comparedRepoGroups.push(payload.rg_name)
        }
        if (!(payload.rg_name in context.rootGetters['common/apiGroups'])) {
            context.dispatch('common/addRepoGroup',payload,{root:true})
        }
    },

    async setBaseRepo(context: any, payload: any) {
        return new Promise((resolve:any, reject:any)=>{
            setTimeout(()=>{
                console.log(payload)
                let baseRepo = payload.rg_name && payload.repo_name ? payload.rg_name + '/' + payload.repo_name : payload.url
                if (!(baseRepo in context.rootGetters['common/apiRepos'])) {
                    context.dispatch('common/addRepo',payload,{root:true}).then((data:any) =>{
                        context.state.baseRepo = baseRepo
                        resolve(data)
                    })
                    context.commit('mutate', {property: baseRepo, with: payload.url})
                } else{
                    context.state.baseRepo = baseRepo
                    resolve({})
                }
            },2000)
        })
    },

    async setBaseGroup(context: any, payload:any) {
        return new Promise((resolve:any, reject:any)=>{
            setTimeout(()=>{
                if (!(payload.rg_name in context.rootGetters['common/apiGroups'])) {
                    context.dispatch('common/addRepoGroup',payload,{root:true}).then((data:any) => {
                        context.state.baseGroup = payload.rg_name
                        resolve(data)
                    })
                } else {
                    context.state.baseGroup = payload.rg_name
                    resolve({})
                }
            },2000)
        })
    },

    async setComparedRepos(context:any, payload:any) {
        return new Promise((resolve:any, reject:any)=>{
            setTimeout(()=>{
                let promises:any[] = [];
                for(let repo of payload) {
                    if (!(repo in context.rootGetters['common/apiGroups'])) {
                        let split:string[]= repo.split('/');
                        promises.push(context.dispatch('common/addRepo',{repo_name:split[1],rg_name:split[0]},{root:true}))
                    }
                }
                 Promise.all(promises).then( (values:any) => {
                     context.state.comparedRepos = payload
                     resolve(values)
                  }
                )
            },2000)
        })
    },

    async setComparedGroup(context:any, payload:any) {
        context.state.comparedRepoGroups = payload
        payload.forEach((group:any) => {
            if (!(group in context.rootGetters['common/apiGroups'])) {
                context.dispatch('common/addRepoGroup',{rg_name: group},{root:true})
            }
        })
    }
}

