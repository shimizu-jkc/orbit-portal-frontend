//Vuex
import Vuex from 'vuex'
import store from './store'
//ElementUI
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import 'element-ui/lib/theme-chalk/index.css'

export default ({
    Vue,
    options,
    router,
    siteData
}) => {
    //Vuex
    Vue.use(Vuex);
    Vue.mixin({ store: store });
    //ElementUI
    Vue.use(ElementUI, {locale});
}