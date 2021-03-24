//Vuex
import Vuex from 'vuex'
import store from './store'
//ElementUI
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import './styles/element-variables.scss';

export default ({
    Vue,
    options,
    router,
    siteData,
    isServer
}) => {
    //Vuex
    Vue.use(Vuex);
    Vue.mixin({ store: store(isServer) });
    //ElementUI
    Vue.use(ElementUI, {locale});
}