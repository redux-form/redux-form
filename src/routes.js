import React from 'react';
import {Router, Route} from 'react-router';
import markdownPage from 'components/markdownPage';
import createHistory from 'history/lib/createHashHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import App from 'pages/App';
import Home from 'pages/Home';
import Simple from 'pages/examples/Simple';
import ComplexValues from 'pages/examples/ComplexValues';
import File from 'pages/examples/File';
import Wizard from 'pages/examples/Wizard';
import Deep from 'pages/examples/Deep';
import SynchronousValidation from 'pages/examples/SynchronousValidation';
import SubmitFromParent from 'pages/examples/SubmitFromParent';
import SubmitValidation from 'pages/examples/SubmitValidation';
import AsynchronousBlurValidation from 'pages/examples/AsynchronousBlurValidation';
import AlternateMountPoint from 'pages/examples/AlternateMountPoint';
import Multirecord from 'pages/examples/Multirecord';
import Normalizing from 'pages/examples/Normalizing';
import Dynamic from 'pages/examples/Dynamic';
import InitializingFromState from 'pages/examples/InitializingFromState';
import Examples from 'pages/examples/Examples.md';
import Faq from 'pages/faq/Faq.md';
import FaqEnterToSubmit from 'pages/faq/EnterToSubmit.md';
import FaqSubmitFunction from 'pages/faq/SubmitFunction.md';
import FaqHandleVsOn from 'pages/faq/HandleVsOn.md';
import FaqHowToClear from 'pages/faq/HowToClear.md';
import FaqReactNative from 'pages/faq/ReactNative.md';
import FaqImmutableJs from 'pages/faq/ImmutableJs.md';
import FaqCustomComponent from 'pages/faq/CustomComponent.md';
import FaqWebsockets from 'pages/faq/WebsocketSubmit.md';
import GettingStarted from 'pages/GettingStarted.md';
import Api from 'pages/api/Api.md';
import ApiReduxForm from 'pages/api/ReduxForm.md';
import ApiReducer from 'pages/api/Reducer.md';
import ApiReducerNormalize from 'pages/api/ReducerNormalize.md';
import ApiReducerPlugin from 'pages/api/ReducerPlugin.md';
import ApiProps from 'pages/api/Props.md';
import ApiActionCreators from 'pages/api/ActionCreators.md';
import ApiGetValues from 'pages/api/GetValues.md';
const scrollableHistory = useScroll(createHistory);

const routes = (
  <Router history={scrollableHistory()}>
    <Route component={App}>
      <Route path="/" component={Home}/>
      <Route path="/api" component={markdownPage(Api)}/>
      <Route path="/api/action-creators" component={markdownPage(ApiActionCreators)}/>
      <Route path="/api/get-values" component={markdownPage(ApiGetValues)}/>
      <Route path="/api/props" component={markdownPage(ApiProps)}/>
      <Route path="/api/reduxForm" component={markdownPage(ApiReduxForm)}/>
      <Route path="/api/reducer" component={markdownPage(ApiReducer)}/>
      <Route path="/api/reducer/normalize" component={markdownPage(ApiReducerNormalize)}/>
      <Route path="/api/reducer/plugin" component={markdownPage(ApiReducerPlugin)}/>
      <Route path="/getting-started" component={markdownPage(GettingStarted)}/>
      <Route path="/examples" component={markdownPage(Examples)}/>
      <Route path="/examples/asynchronous-blur-validation" component={AsynchronousBlurValidation}/>
      <Route path="/examples/alternate-mount-point" component={AlternateMountPoint}/>
      <Route path="/examples/deep" component={Deep}/>
      <Route path="/examples/initializing-from-state" component={InitializingFromState}/>
      <Route path="/examples/dynamic" component={Dynamic}/>
      <Route path="/examples/multirecord" component={Multirecord}/>
      <Route path="/examples/normalizing" component={Normalizing}/>
      <Route path="/examples/simple" component={Simple}/>
      <Route path="/examples/complex" component={ComplexValues}/>
      <Route path="/examples/file" component={File}/>
      <Route path="/examples/wizard" component={Wizard}/>
      <Route path="/examples/submit-validation" component={SubmitValidation}/>
      <Route path="/examples/synchronous-validation" component={SynchronousValidation}/>
      <Route path="/examples/submit-from-parent" component={SubmitFromParent}/>
      <Route path="/faq" component={markdownPage(Faq)}/>
      <Route path="/faq/submit-function" component={markdownPage(FaqSubmitFunction)}/>
      <Route path="/faq/handle-vs-on" component={markdownPage(FaqHandleVsOn)}/>
      <Route path="/faq/how-to-clear" component={markdownPage(FaqHowToClear)}/>
      <Route path="/faq/enter-to-submit" component={markdownPage(FaqEnterToSubmit)}/>
      <Route path="/faq/immutable-js" component={markdownPage(FaqImmutableJs)}/>
      <Route path="/faq/react-native" component={markdownPage(FaqReactNative)}/>
      <Route path="/faq/custom-component" component={markdownPage(FaqCustomComponent)}/>
      <Route path="/faq/websockets" component={markdownPage(FaqWebsockets)}/>
      <Route path="*" component={Home}/>
    </Route>
  </Router>
);

export default routes;
