!function(e,t,r){"use strict";var u="http://192.168.0.143:3000/api",s="authorization",d=t.module("lbServices",["ngResource"]);d.factory("User",["LoopBackResource","LoopBackAuth","$injector",function(e,t){var r=e(u+"/users/:id",{id:"@id"},{prototype$__findById__accessTokens:{url:u+"/users/:id/accessTokens/:fk",method:"GET"},prototype$__destroyById__accessTokens:{url:u+"/users/:id/accessTokens/:fk",method:"DELETE"},prototype$__updateById__accessTokens:{url:u+"/users/:id/accessTokens/:fk",method:"PUT"},prototype$__get__accessTokens:{isArray:!0,url:u+"/users/:id/accessTokens",method:"GET"},prototype$__create__accessTokens:{url:u+"/users/:id/accessTokens",method:"POST"},prototype$__delete__accessTokens:{url:u+"/users/:id/accessTokens",method:"DELETE"},prototype$__count__accessTokens:{url:u+"/users/:id/accessTokens/count",method:"GET"},create:{url:u+"/users",method:"POST"},upsert:{url:u+"/users",method:"PUT"},exists:{url:u+"/users/:id/exists",method:"GET"},findById:{url:u+"/users/:id",method:"GET"},find:{isArray:!0,url:u+"/users",method:"GET"},findOne:{url:u+"/users/findOne",method:"GET"},updateAll:{url:u+"/users/update",method:"POST"},deleteById:{url:u+"/users/:id",method:"DELETE"},count:{url:u+"/users/count",method:"GET"},prototype$updateAttributes:{url:u+"/users/:id",method:"PUT"},login:{params:{include:"user"},interceptor:{response:function(e){var r=e.data;return t.setUser(r.id,r.userId,r.user),t.rememberMe=e.config.params.rememberMe!==!1,t.save(),e.resource}},url:u+"/users/login",method:"POST"},logout:{interceptor:{response:function(e){return t.clearUser(),t.clearStorage(),e.resource}},url:u+"/users/logout",method:"POST"},confirm:{url:u+"/users/confirm",method:"GET"},resetPassword:{url:u+"/users/reset",method:"POST"},getCurrent:{url:u+"/users/:id",method:"GET",params:{id:function(){var e=t.currentUserId;return null==e&&(e="__anonymous__"),e}},interceptor:{response:function(e){return t.currentUserData=e.data,e.resource}},__isGetCurrentUser__:!0}});return r.updateOrCreate=r.upsert,r.update=r.updateAll,r.destroyById=r.deleteById,r.removeById=r.deleteById,r.getCachedCurrent=function(){var e=t.currentUserData;return e?new r(e):null},r.isAuthenticated=function(){return null!=this.getCurrentId()},r.getCurrentId=function(){return t.currentUserId},r.modelName="User",r}]),d.factory("Bike",["LoopBackResource","LoopBackAuth","$injector",function(e){var t=e(u+"/bikes/:id",{id:"@id"},{create:{url:u+"/bikes",method:"POST"},upsert:{url:u+"/bikes",method:"PUT"},exists:{url:u+"/bikes/:id/exists",method:"GET"},findById:{url:u+"/bikes/:id",method:"GET"},find:{isArray:!0,url:u+"/bikes",method:"GET"},findOne:{url:u+"/bikes/findOne",method:"GET"},updateAll:{url:u+"/bikes/update",method:"POST"},deleteById:{url:u+"/bikes/:id",method:"DELETE"},count:{url:u+"/bikes/count",method:"GET"},prototype$updateAttributes:{url:u+"/bikes/:id",method:"PUT"}});return t.updateOrCreate=t.upsert,t.update=t.updateAll,t.destroyById=t.deleteById,t.removeById=t.deleteById,t.modelName="Bike",t}]),d.factory("Manufacturer",["LoopBackResource","LoopBackAuth","$injector",function(e){var t=e(u+"/manufacturers/:id",{id:"@id"},{create:{url:u+"/manufacturers",method:"POST"},upsert:{url:u+"/manufacturers",method:"PUT"},exists:{url:u+"/manufacturers/:id/exists",method:"GET"},findById:{url:u+"/manufacturers/:id",method:"GET"},find:{isArray:!0,url:u+"/manufacturers",method:"GET"},findOne:{url:u+"/manufacturers/findOne",method:"GET"},updateAll:{url:u+"/manufacturers/update",method:"POST"},deleteById:{url:u+"/manufacturers/:id",method:"DELETE"},count:{url:u+"/manufacturers/count",method:"GET"},prototype$updateAttributes:{url:u+"/manufacturers/:id",method:"PUT"},"::get::brand::manufacturer":{url:u+"/brands/:id/manufacturer",method:"GET"}});return t.updateOrCreate=t.upsert,t.update=t.updateAll,t.destroyById=t.deleteById,t.removeById=t.deleteById,t.modelName="Manufacturer",t}]),d.factory("Brand",["LoopBackResource","LoopBackAuth","$injector",function(e,t,r){var s=e(u+"/brands/:id",{id:"@id"},{prototype$__get__manufacturer:{url:u+"/brands/:id/manufacturer",method:"GET"},create:{url:u+"/brands",method:"POST"},upsert:{url:u+"/brands",method:"PUT"},exists:{url:u+"/brands/:id/exists",method:"GET"},findById:{url:u+"/brands/:id",method:"GET"},find:{isArray:!0,url:u+"/brands",method:"GET"},findOne:{url:u+"/brands/findOne",method:"GET"},updateAll:{url:u+"/brands/update",method:"POST"},deleteById:{url:u+"/brands/:id",method:"DELETE"},count:{url:u+"/brands/count",method:"GET"},prototype$updateAttributes:{url:u+"/brands/:id",method:"PUT"}});return s.updateOrCreate=s.upsert,s.update=s.updateAll,s.destroyById=s.deleteById,s.removeById=s.deleteById,s.modelName="Brand",s.manufacturer=function(){var e=r.get("Manufacturer"),t=e["::get::brand::manufacturer"];return t.apply(s,arguments)},s}]),d.factory("Authmessage",["LoopBackResource","LoopBackAuth","$injector",function(e){var t=e(u+"/authmessages/:id",{id:"@id"},{create:{url:u+"/authmessages",method:"POST"},upsert:{url:u+"/authmessages",method:"PUT"},exists:{url:u+"/authmessages/:id/exists",method:"GET"},findById:{url:u+"/authmessages/:id",method:"GET"},find:{isArray:!0,url:u+"/authmessages",method:"GET"},findOne:{url:u+"/authmessages/findOne",method:"GET"},updateAll:{url:u+"/authmessages/update",method:"POST"},deleteById:{url:u+"/authmessages/:id",method:"DELETE"},count:{url:u+"/authmessages/count",method:"GET"},prototype$updateAttributes:{url:u+"/authmessages/:id",method:"PUT"}});return t.updateOrCreate=t.upsert,t.update=t.updateAll,t.destroyById=t.deleteById,t.removeById=t.deleteById,t.modelName="Authmessage",t}]),d.factory("Cruise",["LoopBackResource","LoopBackAuth","$injector",function(e){var t=e(u+"/cruises/:id",{id:"@id"},{create:{url:u+"/cruises",method:"POST"},upsert:{url:u+"/cruises",method:"PUT"},exists:{url:u+"/cruises/:id/exists",method:"GET"},findById:{url:u+"/cruises/:id",method:"GET"},find:{isArray:!0,url:u+"/cruises",method:"GET"},findOne:{url:u+"/cruises/findOne",method:"GET"},updateAll:{url:u+"/cruises/update",method:"POST"},deleteById:{url:u+"/cruises/:id",method:"DELETE"},count:{url:u+"/cruises/count",method:"GET"},prototype$updateAttributes:{url:u+"/cruises/:id",method:"PUT"}});return t.updateOrCreate=t.upsert,t.update=t.updateAll,t.destroyById=t.deleteById,t.removeById=t.deleteById,t.modelName="Cruise",t}]),d.factory("Test",["LoopBackResource","LoopBackAuth","$injector",function(e){var t=e(u+"/tests/:id",{id:"@id"},{create:{url:u+"/tests",method:"POST"},upsert:{url:u+"/tests",method:"PUT"},exists:{url:u+"/tests/:id/exists",method:"GET"},findById:{url:u+"/tests/:id",method:"GET"},find:{isArray:!0,url:u+"/tests",method:"GET"},findOne:{url:u+"/tests/findOne",method:"GET"},updateAll:{url:u+"/tests/update",method:"POST"},deleteById:{url:u+"/tests/:id",method:"DELETE"},count:{url:u+"/tests/count",method:"GET"},prototype$updateAttributes:{url:u+"/tests/:id",method:"PUT"}});return t.updateOrCreate=t.upsert,t.update=t.updateAll,t.destroyById=t.deleteById,t.removeById=t.deleteById,t.modelName="Test",t}]),d.factory("Device",["LoopBackResource","LoopBackAuth","$injector",function(e){var t=e(u+"/devices/:id",{id:"@id"},{create:{url:u+"/devices",method:"POST"},upsert:{url:u+"/devices",method:"PUT"},exists:{url:u+"/devices/:id/exists",method:"GET"},findById:{url:u+"/devices/:id",method:"GET"},find:{isArray:!0,url:u+"/devices",method:"GET"},findOne:{url:u+"/devices/findOne",method:"GET"},updateAll:{url:u+"/devices/update",method:"POST"},deleteById:{url:u+"/devices/:id",method:"DELETE"},count:{url:u+"/devices/count",method:"GET"},prototype$updateAttributes:{url:u+"/devices/:id",method:"PUT"}});return t.updateOrCreate=t.upsert,t.update=t.updateAll,t.destroyById=t.deleteById,t.removeById=t.deleteById,t.modelName="Device",t}]),d.factory("LoopBackAuth",function(){function e(){var e=this;s.forEach(function(t){e[t]=u(t)}),this.rememberMe=r,this.currentUserData=null}function t(e,t,r){var u=d+t;null==r&&(r=""),e[u]=r}function u(e){var t=d+e;return localStorage[t]||sessionStorage[t]||null}var s=["accessTokenId","currentUserId"],d="$LoopBack$";return e.prototype.save=function(){var e=this,r=this.rememberMe?localStorage:sessionStorage;s.forEach(function(u){t(r,u,e[u])})},e.prototype.setUser=function(e,t,r){this.accessTokenId=e,this.currentUserId=t,this.currentUserData=r},e.prototype.clearUser=function(){this.accessTokenId=null,this.currentUserId=null,this.currentUserData=null},e.prototype.clearStorage=function(){s.forEach(function(e){t(sessionStorage,e,null),t(localStorage,e,null)})},new e}).config(["$httpProvider",function(e){e.interceptors.push("LoopBackAuthRequestInterceptor")}]).factory("LoopBackAuthRequestInterceptor",["$q","LoopBackAuth",function(e,t){return{request:function(d){if(d.url.substr(0,u.length)!==u)return d;if(t.accessTokenId)d.headers[s]=t.accessTokenId;else if(d.__isGetCurrentUser__){var o={body:{error:{status:401}},status:401,config:d,headers:function(){return r}};return e.reject(o)}return d||e.when(d)}}}]).provider("LoopBackResource",function(){this.setAuthHeader=function(e){s=e},this.setUrlBase=function(e){u=e},this.$get=["$resource",function(e){return function(t,r,u){var s=e(t,r,u);return s.prototype.$save=function(e,t){var r=s.upsert.call(this,{},this,e,t);return r.$promise||r},s}}]})}(window,window.angular);