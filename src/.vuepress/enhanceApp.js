import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import 'element-ui/lib/theme-chalk/index.css'

export default ({
    Vue,
    options,
    router,
    siteData
}) => {
    //Element UI
    Vue.use(ElementUI, {locale});
}